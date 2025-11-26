package com.getcapacitor;

import android.content.Context;
import android.util.AttributeSet;
import android.webkit.WebView;

public class CapacitorWebView extends WebView {

    public CapacitorWebView(Context context) {
        super(context);
        init();
    }

    public CapacitorWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public CapacitorWebView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        boolean foundOptOut = false;
    }
}
