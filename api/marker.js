const DRIVE_URL = 'https://drive.usercontent.google.com./download?id=1NI36csAzObsrfYyP3RaftDd_H-VfLZmb&export=download&confirm=t';
const MARKER_NAME_RE = /^download-\d{6}-\d{3}$/;

module.exports = function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.status(405).send('Method not allowed');
    return;
  }

  const value = Array.isArray(request.query.name) ? request.query.name[0] : request.query.name;
  const name = typeof value === 'string' ? value : '';
  if (!MARKER_NAME_RE.test(name)) {
    response.status(400).send('Invalid marker name');
    return;
  }

  const escapedDriveUrl = DRIVE_URL.replaceAll('&', '&amp;');
  const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${name}</title>
  <meta property="og:title" content="${name}">
</head>
<body>
  <video controls><source src="${escapedDriveUrl}" type="video/mp4"></video>
</body>
</html>`;

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method === 'HEAD') {
    response.status(200).end();
  } else {
    response.status(200).send(page);
  }
};
