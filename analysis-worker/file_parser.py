"""
File parser: reads CSV/XLSX files and auto-detects column mapping.
Supports flexible column names in French/English.
"""
import csv
import io
import re
from pathlib import Path
from typing import Optional

import openpyxl


ASIN_RE = re.compile(r'^B0[A-Z0-9]{8}$')
EAN_RE = re.compile(r'^\d{13}$')


def parse_file(file_bytes: bytes, file_name: str, frontend_mapping: dict = None) -> tuple[list[dict], dict]:
    """
    Parse a CSV or XLSX file and auto-detect columns.
    If frontend_mapping is provided (from the UI column picker), use it instead of auto-detection.
    frontend_mapping format: {"asin": "Column Header", "ean": "Column Header", "price": "Column Header"}
    Returns (rows, column_mapping) where:
      - rows: list of dicts with keys: asin, ean, price, name (any may be None)
      - column_mapping: dict describing detected columns {role: column_header}
    """
    ext = Path(file_name).suffix.lower()
    if ext in ('.xlsx', '.xls'):
        raw_rows, headers = _read_excel(file_bytes)
    elif ext == '.csv':
        raw_rows, headers = _read_csv(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: {ext}. Use .csv, .xlsx, or .xls")

    if not headers or not raw_rows:
        raise ValueError("File is empty or has no data rows")

    # Use frontend mapping if provided, otherwise auto-detect
    if frontend_mapping and any(frontend_mapping.get(k) for k in ('asin', 'ean', 'price')):
        mapping = {}
        for key in ('asin', 'ean', 'price'):
            col = frontend_mapping.get(key)
            if col and col in headers:
                mapping[key] = col
        # Try to auto-detect name column since frontend doesn't map it
        name_mapping = _detect_columns(headers, raw_rows)
        if name_mapping.get('name'):
            mapping['name'] = name_mapping['name']
        # If frontend mapping didn't match any headers, fallback to full auto-detect
        if not mapping.get('asin') and not mapping.get('ean'):
            mapping = _detect_columns(headers, raw_rows)
    else:
        mapping = _detect_columns(headers, raw_rows)

    if not mapping.get('asin') and not mapping.get('ean'):
        raise ValueError("Could not detect ASIN or EAN column. Ensure your file contains product identifiers.")

    if not mapping.get('price'):
        raise ValueError("Could not detect a price column. Ensure your file contains a price column.")

    rows = []
    for raw in raw_rows:
        row = {}
        if mapping.get('asin'):
            val = str(raw.get(mapping['asin'], '')).strip().upper()
            row['asin'] = val if ASIN_RE.match(val) else None
        else:
            row['asin'] = None

        if mapping.get('ean'):
            val = str(raw.get(mapping['ean'], '')).strip()
            row['ean'] = val if EAN_RE.match(val) else None
        else:
            row['ean'] = None

        if mapping.get('price'):
            row['price'] = _parse_price(raw.get(mapping['price'], ''))
        else:
            row['price'] = None

        if mapping.get('name'):
            row['name'] = str(raw.get(mapping['name'], '')).strip() or None
        else:
            row['name'] = None

        # Skip rows without identifier or price
        if (row['asin'] or row['ean']) and row['price'] is not None:
            rows.append(row)

    return rows, mapping


def _read_csv(file_bytes: bytes) -> tuple[list[dict], list[str]]:
    """Read CSV file, auto-detect encoding, delimiter, and header."""
    for encoding in ('utf-8', 'latin-1', 'cp1252'):
        try:
            text = file_bytes.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    else:
        text = file_bytes.decode('utf-8', errors='replace')

    # Auto-detect delimiter
    sniffer = csv.Sniffer()
    try:
        dialect = sniffer.sniff(text[:4096])
    except csv.Error:
        dialect = csv.excel

    # Read all lines first to check if first row is header or data
    lines = list(csv.reader(io.StringIO(text), dialect=dialect))
    if not lines:
        return [], []

    first_row = lines[0]

    # Detect if first row is a header or data
    is_data = False
    for val in first_row:
        s = val.strip() if val else ''
        if ASIN_RE.match(s.upper()):
            is_data = True
            break
        if EAN_RE.match(s):
            is_data = True
            break
        try:
            f = float(s.replace(',', '.').replace('€', '').replace('$', '').strip())
            if 0.01 <= f <= 50000:
                is_data = True
                break
        except (ValueError, AttributeError):
            pass

    if is_data:
        headers = [f'col_{i}' for i in range(len(first_row))]
        data_lines = lines
    else:
        headers = [h.strip() if h else f'col_{i}' for i, h in enumerate(first_row)]
        data_lines = lines[1:]

    rows = []
    for line in data_lines:
        row_dict = {}
        for i, val in enumerate(line):
            if i < len(headers):
                row_dict[headers[i]] = val
        rows.append(row_dict)

    return rows, headers


def _read_excel(file_bytes: bytes) -> tuple[list[dict], list[str]]:
    """Read first sheet of Excel file. Auto-detects if first row is header or data."""
    wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
    ws = wb.active
    all_rows = list(ws.iter_rows(values_only=True))
    wb.close()

    if not all_rows:
        return [], []

    first_row = all_rows[0]

    # Detect if first row is a header or data
    # If any cell in the first row looks like an ASIN, EAN, or numeric price, it's likely data
    is_data = False
    for val in first_row:
        s = str(val).strip() if val else ''
        if ASIN_RE.match(s.upper()):
            is_data = True
            break
        if EAN_RE.match(s):
            is_data = True
            break
        # If it's a number that could be a price, likely data
        try:
            f = float(s.replace(',', '.').replace('€', '').replace('$', '').strip())
            if 0.01 <= f <= 50000:
                is_data = True
                break
        except (ValueError, AttributeError):
            pass

    if is_data:
        # No header row — generate column names
        headers = [f'col_{i}' for i in range(len(first_row))]
        data_rows = all_rows
    else:
        headers = [str(h).strip() if h else f'col_{i}' for i, h in enumerate(first_row)]
        data_rows = all_rows[1:]

    rows = []
    for row in data_rows:
        row_dict = {}
        for i, val in enumerate(row):
            if i < len(headers):
                row_dict[headers[i]] = val if val is not None else ''
        rows.append(row_dict)

    return rows, headers


def _detect_columns(headers: list[str], rows: list[dict]) -> dict:
    """Auto-detect column roles by header names and sample data."""
    mapping = {}
    headers_lower = {h: h.lower().strip() for h in headers}

    # Header-based detection
    asin_keywords = ['asin']
    ean_keywords = ['ean', 'gtin', 'barcode', 'code barre', 'code-barre']
    price_keywords = ['prix', 'price', 'cout', 'cost', 'ttc', 'prix ttc', 'prix achat', 'buy price', 'purchase']
    name_keywords = ['nom', 'name', 'titre', 'title', 'produit', 'product', 'description', 'designation', 'libelle']

    for header, lower in headers_lower.items():
        if not mapping.get('asin') and any(k == lower or k in lower for k in asin_keywords):
            mapping['asin'] = header
        if not mapping.get('ean') and any(k == lower or k in lower for k in ean_keywords):
            mapping['ean'] = header
        if not mapping.get('price') and any(k == lower or k in lower for k in price_keywords):
            mapping['price'] = header
        if not mapping.get('name') and any(k == lower or k in lower for k in name_keywords):
            mapping['name'] = header

    # Fallback: data-based detection (sample first 20 rows)
    sample = rows[:20]
    if not mapping.get('asin') or not mapping.get('ean') or not mapping.get('price'):
        for header in headers:
            if header in mapping.values():
                continue
            values = [str(row.get(header, '')).strip() for row in sample if row.get(header)]
            if not values:
                continue

            if not mapping.get('asin') and sum(1 for v in values if ASIN_RE.match(v.upper())) > len(values) * 0.5:
                mapping['asin'] = header
                continue

            if not mapping.get('ean') and sum(1 for v in values if EAN_RE.match(v)) > len(values) * 0.5:
                mapping['ean'] = header
                continue

            if not mapping.get('price'):
                numeric_count = sum(1 for v in values if _parse_price(v) is not None)
                if numeric_count > len(values) * 0.5:
                    # Check it's likely a price (reasonable range)
                    prices = [_parse_price(v) for v in values if _parse_price(v) is not None]
                    if prices and 0.01 <= max(prices) <= 10000:
                        mapping['price'] = header
                        continue

    return mapping


def _parse_price(value) -> Optional[float]:
    """Parse a price value from various formats."""
    if value is None:
        return None
    s = str(value).strip()
    if not s:
        return None

    # Remove currency symbols and spaces
    s = re.sub(r'[€$£\s]', '', s)
    # Handle comma as decimal separator (European format)
    if ',' in s and '.' in s:
        s = s.replace(',', '')  # 1,234.56 format
    elif ',' in s:
        s = s.replace(',', '.')  # 12,50 format

    try:
        val = float(s)
        return val if val > 0 else None
    except ValueError:
        return None
