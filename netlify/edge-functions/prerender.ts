const BOT_AGENTS = [
  'googlebot',
  'yahoo! slurp',
  'bingbot',
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkshare',
  'w3c_validator',
  'redditbot',
  'applebot',
  'whatsapp',
  'flipboard',
  'tumblr',
  'bitlybot',
  'skypeuripreview',
  'nuzzel',
  'discordbot',
  'google page speed',
  'qwantify',
  'pinterestbot',
  'bitrix link preview',
  'xing-contenttabreceiver',
  'chrome-lighthouse',
  'telegrambot',
];

const IGNORE_EXTENSIONS = [
  '.js', '.css', '.xml', '.less', '.png', '.jpg', '.jpeg', '.gif', '.pdf',
  '.doc', '.txt', '.ico', '.rss', '.zip', '.mp3', '.rar', '.exe', '.wmv',
  '.doc', '.avi', '.ppt', '.mpg', '.mpeg', '.tif', '.wav', '.mov', '.psd',
  '.ai', '.xls', '.mp4', '.m4a', '.swf', '.dat', '.dmg', '.iso', '.flv',
  '.m4v', '.torrent', '.ttf', '.woff', '.woff2', '.svg', '.eot', '.webp',
  '.webm', '.json', '.map',
];

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // Check if it's a static file
  const isStaticFile = IGNORE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext));
  if (isStaticFile) {
    return context.next();
  }
  
  // Check if it's a bot
  const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));
  if (!isBot) {
    return context.next();
  }
  
  // Check if already prerendered (avoid loops)
  if (request.headers.get('x-prerender')) {
    return context.next();
  }
  
  const prerenderToken = Deno.env.get('PRERENDER_TOKEN');
  if (!prerenderToken) {
    console.error('PRERENDER_TOKEN not configured');
    return context.next();
  }
  
  try {
    const prerenderUrl = `https://service.prerender.io/${url.href}`;
    
    const prerenderResponse = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': prerenderToken,
        'X-Prerender-Int-Type': 'netlify',
      },
    });
    
    if (!prerenderResponse.ok) {
      console.error(`Prerender error: ${prerenderResponse.status}`);
      return context.next();
    }
    
    const html = await prerenderResponse.text();
    
    return new Response(html, {
      status: prerenderResponse.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Prerendered': 'true',
      },
    });
  } catch (error) {
    console.error('Prerender fetch error:', error);
    return context.next();
  }
};

export const config = {
  path: '/*',
};
