export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'OPTIONS') {
    return new Response('', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } });
  }

  const { path, method, body } = await request.json();
  
  const response = await fetch('https://api.notion.com' + path, {
    method: method || 'GET',
    headers: {
      'Authorization': 'Bearer ' + env.NOTION_TOKEN,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.text();
  return new Response(data, { headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' } });
}
