'use client';

const LOGO_TEXT = 'Mori EOShip';
const fmtN = (n) => (parseFloat(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function toDataURL(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

const PRINT_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Poppins','Noto Sans Thai',sans-serif;background:#fff;color:#222;padding:32px 40px;font-size:11px;max-width:850px;margin:0 auto}
@media print{body{padding:16px 24px}@page{margin:10mm}}
h1.doc-title{font-size:20px;font-weight:700;text-align:center;margin-bottom:4px}
h2.doc-sub{font-size:12px;font-weight:400;text-align:center;color:#666;margin-bottom:20px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
.logo-area{text-align:right}
.logo-area img{height:48px;object-fit:contain}
.logo-area .co-name{font-size:14px;font-weight:700;color:#0a1628;margin-top:2px}
.info-row{display:flex;margin-bottom:3px;font-size:11px}
.info-label{width:110px;font-weight:600;color:#555;flex-shrink:0}
.info-value{flex:1;color:#222}
.info-cols{display:flex;gap:30px}
.info-col{flex:1}
.divider{border:none;border-top:1.5px solid #333;margin:14px 0}
.divider-light{border:none;border-top:1px solid #ccc;margin:12px 0}
table.dt{width:100%;border-collapse:collapse;margin:12px 0;font-size:10px}
table.dt th{border:1px solid #555;padding:6px 8px;font-weight:700;text-align:center;background:#e8edf5}
table.dt th.purple{background:#7c3aed;color:white}
table.dt th.blue{background:#4361ee;color:white}
table.dt td{border:1px solid #ccc;padding:5px 8px;text-align:center;font-size:10px}
table.dt td:nth-child(2){text-align:left}
.weight-section{margin:16px 0}
.weight-row{display:flex;align-items:center;font-size:12px;margin-bottom:4px}
.weight-row .wl{width:130px;font-weight:600;text-align:right;padding-right:12px}
.weight-row .wv{width:80px;text-align:right;font-weight:500;padding-right:8px}
.weight-row .wu{width:40px;color:#666}
.weight-row .wx{width:20px;text-align:center;color:#666}
.weight-row .wp{width:80px;text-align:right}
.weight-row .wpu{width:40px;color:#666}
.weight-row .wa{width:110px;text-align:right;font-weight:600}
.weight-row .wau{width:40px;color:#666}
.total-row{display:flex;justify-content:flex-end;align-items:center;font-size:14px;font-weight:700;padding:8px 0;border-top:2px solid #333;margin-top:4px}
.total-row .tl{padding-right:16px}
.total-row .tv{min-width:120px;text-align:right;padding-right:8px}
.payment-section{margin-top:28px;padding-top:14px;border-top:1px solid #ccc}
.sign-area{display:flex;justify-content:space-between;margin-top:32px}
.sign-box{text-align:center;width:160px}
.sign-box .sign-line{border-bottom:1px dotted #999;height:36px;margin-bottom:4px}
.sign-box .sign-label{font-size:9px;color:#888}
.footer{margin-top:20px;text-align:center;font-size:8px;color:#bbb}
`;

export async function printExportPDF(data, boxes) {
  const logoBase64 = await toDataURL('/logo-print.png') || '';
  let parsedBoxes = [];
  if (boxes && boxes.length > 0) {
    for (const b of boxes) {
      let items = b.items || [];
      if (typeof items === 'string') { try { items = JSON.parse(items); } catch(e) { items = []; } }
      if (!Array.isArray(items)) items = [items];
      let photos = b.photos || {};
      if (typeof photos === 'string') { try { photos = JSON.parse(photos); } catch(e) { photos = {}; } }
      parsedBoxes.push({ ...b, items, photos });
    }
  }

  const boxRows = parsedBoxes.map((b, i) => {
    const itemNames = b.items.map(it => it.item || '-').join(', ');
    return `<tr><td>${b.box_code || (i+1)}</td><td style="text-align:left">${itemNames || '-'}</td><td>${b.box_l||'-'}</td><td>${b.box_w||'-'}</td><td>${b.box_h||'-'}</td><td>${b.dimension||'-'}</td><td>${b.gross_weight||'-'}</td><td>${b.weight_result||'-'} Kg.</td></tr>`;
  }).join('');

  const html = buildDoc({
    logoBase64,
    title: 'PACKING LIST',
    subtitle: 'Export — ' + (data.order_code || ''),
    leftInfo: [
      ['Export Date', data.export_date || '-'],
      ['Order Code', data.order_code || '-'],
      ['Client', data.client || '-'],
      ['Box Type', data.box_type || '-'],
    ],
    rightInfo: [
      ['MAWB No', data.mawb_no || '-'],
      ['Sender', data.sender || '-'],
      ['Recipient', data.recipient || '-'],
      ['Payment', data.payment || '-'],
    ],
    bodyHTML: `
      ${boxRows ? `<table class="dt">
        <thead><tr><th class="purple">Carton No.</th><th class="purple">Items</th><th colspan="3" class="blue">Dimension (cm.)</th><th class="blue">Dim.</th><th class="blue">GW.</th><th class="blue">Summary</th></tr>
        <tr><th></th><th></th><th>L</th><th>W</th><th>H</th><th></th><th></th><th></th></tr></thead>
        <tbody>${boxRows}</tbody>
      </table>` : '<p style="color:#999;text-align:center;padding:20px">No boxes</p>'}
      ${data.remark ? `<div style="margin-top:12px;font-size:10px"><b>Remark:</b> ${data.remark}</div>` : ''}
    `,
    showPayment: false,
    showSign: false,
  });

  openPrint(html);
}

export async function printClientPDF(data) {
  const logoBase64 = await toDataURL('/logo-print.png') || '';

  let imagesHTML = '';
  const imageFields = [['ID Card', data.id_card_image],['Profile', data.profile_image],['Sender', data.sender_image],['Recipient', data.recipient_image]];
  for (const [label, url] of imageFields) {
    if (url) {
      const d = await toDataURL(url);
      if (d) imagesHTML += `<div style="display:inline-block;margin:6px;text-align:center"><img src="${d}" style="max-height:120px;border-radius:6px"/><div style="font-size:9px;color:#888;margin-top:2px">${label}</div></div>`;
    }
  }

  const html = buildDoc({
    logoBase64,
    title: 'CLIENT INFORMATION',
    subtitle: data.client_code || '',
    leftInfo: [
      ['Name', data.name || '-'],
      ['Origin-Dest', data.origin_destination || '-'],
      ['Nationality', data.nationality || '-'],
      ['Gender', data.gender || '-'],
    ],
    rightInfo: [
      ['Contact', data.contact_channel || '-'],
      ['Supporter', data.supporter || '-'],
      ['Sender Phone', data.sender_phone || '-'],
      ['Recipient Phone', data.recipient_phone || '-'],
    ],
    bodyHTML: `
      ${data.sender_address ? `<div style="margin-bottom:8px"><b>Sender Address:</b> ${data.sender_address}</div>` : ''}
      ${data.recipient_address ? `<div style="margin-bottom:8px"><b>Recipient Address:</b> ${data.recipient_address}</div>` : ''}
      ${data.remark ? `<div style="margin-bottom:8px"><b>Remark:</b> ${data.remark}</div>` : ''}
      ${imagesHTML ? `<div style="margin-top:12px">${imagesHTML}</div>` : ''}
    `,
    showPayment: false,
    showSign: false,
  });

  openPrint(html);
}

export async function printNotePDF(data) {
  const logoBase64 = await toDataURL('/logo-print.png') || '';

  let imagesHTML = '';
  if (data.images && data.images.length > 0) {
    for (const url of data.images) {
      const d = await toDataURL(url);
      if (d) imagesHTML += `<div style="display:inline-block;margin:6px"><img src="${d}" style="max-height:140px;border-radius:6px"/></div>`;
    }
  }

  const html = buildDoc({
    logoBase64,
    title: 'NOTE',
    subtitle: data.topic || '',
    leftInfo: [
      ['Date', data.date || '-'],
      ['Topic', data.topic || '-'],
    ],
    rightInfo: [
      ['Type', data.type || '-'],
    ],
    bodyHTML: `
      ${data.description ? `<div style="margin:12px 0;font-size:11px;line-height:1.7;white-space:pre-wrap">${data.description}</div>` : ''}
      ${imagesHTML ? `<div style="margin-top:12px">${imagesHTML}</div>` : ''}
    `,
    showPayment: false,
    showSign: false,
  });

  openPrint(html);
}

export async function printInvoicePDF(ef) {
  const logoBase64 = await toDataURL('/logo-print.png') || '';
  const priceLine = (parseFloat(ef.price_per_kg)||0) * (parseFloat(ef.weight_result)||0);
  const diffLine = (parseFloat(ef.price_per_diff)||0) * (parseFloat(ef.weight_diff)||0);
  const total = priceLine + diffLine;

  const html = buildDoc({
    logoBase64,
    title: 'PACKING LIST / INVOICE',
    subtitle: '',
    leftInfo: [
      ['Export Date', ef.export_date || '-'],
      ['Sender', ef.client || '-'],
      ['Recipient', '-'],
    ],
    rightInfo: [
      ['Origin-Dest', ef.origin_destination || '-'],
      ['Order Code', ef.order_code || '-'],
      ['Service', ef.service_type || '-'],
    ],
    bodyHTML: `
      <div class="weight-section">
        <div style="font-size:12px;font-weight:700;margin-bottom:8px;text-align:center">Weight Details</div>
        <div class="weight-row"><span class="wl">Gross Weight</span><span class="wv">${fmtN(ef.weight_result)}</span><span class="wu">Kg.</span><span class="wx">x</span><span class="wp">${fmtN(ef.price_per_kg)}</span><span class="wpu">THB</span><span class="wa">${fmtN(priceLine)}</span><span class="wau">THB</span></div>
        ${parseFloat(ef.weight_diff) > 0 ? `<div class="weight-row"><span class="wl">Difference</span><span class="wv">${fmtN(ef.weight_diff)}</span><span class="wu">Kg.</span><span class="wx">x</span><span class="wp">${fmtN(ef.price_per_diff)}</span><span class="wpu">THB</span><span class="wa">${fmtN(diffLine)}</span><span class="wau">THB</span></div>` : ''}
        <div class="total-row"><span class="tl">TOTAL CHARGE</span><span class="tv">${fmtN(ef.total_thb || total)}</span><span style="width:40px">THB</span></div>
        ${parseFloat(ef.total_mnt) > 0 ? `<div style="display:flex;justify-content:flex-end;font-size:12px;font-weight:600;padding-top:4px"><span style="padding-right:16px">TOTAL MNT</span><span style="min-width:120px;text-align:right;padding-right:8px">${fmtN(ef.total_mnt)}</span><span style="width:40px">MNT</span></div>` : ''}
      </div>
      ${ef.remark ? `<div style="margin-top:8px;font-size:10px"><b>Remark:</b> ${ef.remark}</div>` : ''}
    `,
    showPayment: true,
    showSign: true,
  });

  openPrint(html);
}

function buildDoc({ logoBase64, title, subtitle, leftInfo, rightInfo, bodyHTML, showPayment, showSign }) {
  const leftRows = leftInfo.map(([l,v]) => `<div class="info-row"><span class="info-label">${l}:</span><span class="info-value">${v}</span></div>`).join('');
  const rightRows = rightInfo.map(([l,v]) => `<div class="info-row"><span class="info-label">${l}:</span><span class="info-value">${v}</span></div>`).join('');
  const logoImg = logoBase64 ? `<img src="${logoBase64}" alt="Logo" />` : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>${PRINT_CSS}</style></head><body>

<h1 class="doc-title">${title}</h1>
${subtitle ? `<h2 class="doc-sub">${subtitle}</h2>` : ''}

<div class="header">
  <div class="info-cols" style="flex:1">
    <div class="info-col">${leftRows}</div>
    <div class="info-col">${rightRows}</div>
  </div>
  <div class="logo-area">
    ${logoImg}
    <div class="co-name">${LOGO_TEXT}</div>
  </div>
</div>

<hr class="divider" />

${bodyHTML}

${showPayment ? `
<div class="payment-section">
  <div style="font-size:11px;font-weight:700;margin-bottom:8px">Payment Information:</div>
  <div style="font-size:10px;line-height:2">
    <span style="margin-right:24px">☐ Cash</span>
    <span style="margin-right:24px">☐ Transfer</span>
    <span>☐ Other .................................</span>
  </div>
</div>` : ''}

${showSign ? `
<div class="sign-area">
  <div class="sign-box"><div class="sign-line"></div><div class="sign-label">Approved by</div><div style="font-size:8px;color:#aaa;margin-top:2px">Date .........................</div></div>
  <div class="sign-box"><div class="sign-line"></div><div class="sign-label">Received by</div><div style="font-size:8px;color:#aaa;margin-top:2px">Date .........................</div></div>
</div>` : ''}

<div class="footer">${LOGO_TEXT} — Generated: ${new Date().toLocaleString()}</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`;
}

function openPrint(html) {
  const w = window.open('', '_blank', 'width=850,height=600');
  w.document.write(html);
  w.document.close();
}
