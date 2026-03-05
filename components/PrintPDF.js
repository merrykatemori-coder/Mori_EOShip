'use client';

const LOGO_TEXT = 'Mori EOShip';
const LOGO_URL = 'https://raw.githubusercontent.com/jamelone23lhoho-alt/temporary_PKate/refs/heads/main/pic/logo.png';
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
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function printExportPDF(data, boxes) {
  const logoBase64 = await toDataURL('/logo.png') || '';
  const fields = [
    ['Order Code', data.order_code], ['Client', data.client],
    ['Date', data.export_date], ['MAWB No', data.mawb_no],
    ['Item', data.item], ['Sender', data.sender],
    ['Sender Phone', data.sender_phone], ['Recipient', data.recipient],
    ['Recipient Phone', data.recipient_phone], ['Total Boxes', data.total_boxs],
    ['Total GW', data.total_gw], ['Bill THB', data.bill_thb],
    ['Bill MNT', data.bill_mnt], ['Payment', data.payment],
    ['Box Type', data.box_type], ['Remark', data.remark],
  ];

  let boxesHTML = '';
  if (boxes && boxes.length > 0) {
    for (const b of boxes) {
      let photosHTML = '';
      const photos = b.photos || {};
      const photoLabels = { received_package: 'Received package', items_in_box: 'Items in the box', box_and_weight: 'Box and weight', other_1: 'Other 1', other_2: 'Other 2' };
      for (const [key, label] of Object.entries(photoLabels)) {
        if (photos[key]) {
          const d = await toDataURL(photos[key]);
          if (d) photosHTML += `<div style="display:inline-block;margin:4px;text-align:center"><img src="${d}" style="max-height:100px;border-radius:6px"/><div style="font-size:9px;color:#888;margin-top:2px">${label}</div></div>`;
        }
      }
      const rawItems = typeof b.items === 'string' ? JSON.parse(b.items || '[]') : (b.items || []);
      const items = rawItems.map(it => `<tr><td style="padding:4px 8px;border:1px solid #e0e0e0;font-size:11px">${it.item||'-'}</td><td style="padding:4px 8px;border:1px solid #e0e0e0;font-size:11px;text-align:center">${it.unit||'-'}</td><td style="padding:4px 8px;border:1px solid #e0e0e0;font-size:11px">${it.type||'-'}</td></tr>`).join('');
      boxesHTML += `
        <div style="margin-top:12px;padding:12px;border:1px solid #e0d8d0;border-radius:8px;background:#faf8f5">
          <div style="font-weight:700;color:#c0392b;margin-bottom:6px;font-size:13px">${b.box_code || 'Box'}</div>
          <table style="width:100%;font-size:11px;margin-bottom:6px"><tr>
            <td><b>Size:</b> ${b.box_w}×${b.box_h}×${b.box_l} cm</td>
            <td><b>Dim:</b> ${b.dimension}</td>
            <td><b>GW:</b> ${b.gross_weight} kg</td>
            <td><b>WR:</b> ${b.weight_result} kg</td>
          </tr></table>
          ${items ? `<table style="width:100%;border-collapse:collapse;margin-bottom:6px"><thead><tr style="background:#e8ddd3"><th style="padding:4px 8px;border:1px solid #e0e0e0;font-size:10px;text-align:left">Item</th><th style="padding:4px 8px;border:1px solid #e0e0e0;font-size:10px;text-align:center">Unit</th><th style="padding:4px 8px;border:1px solid #e0e0e0;font-size:10px;text-align:left">Type</th></tr></thead><tbody>${items}</tbody></table>` : ''}
          ${photosHTML ? `<div style="margin-top:6px">${photosHTML}</div>` : ''}
        </div>`;
    }
  }

  openPrintWindow('Export — ' + (data.order_code || ''), fields, boxesHTML ? `<div style="margin-top:16px"><div style="font-size:14px;font-weight:700;color:#c0392b;margin-bottom:8px">Boxes (${boxes.length})</div>${boxesHTML}</div>` : '', logoBase64);
}

export async function printClientPDF(data) {
  const logoBase64 = await toDataURL('/logo.png') || '';
  const fields = [
    ['Client Code', data.client_code], ['Name', data.name],
    ['Nationality', data.nationality], ['Gender', data.gender],
    ['Contact Channel', data.contact_channel], ['Supporter', data.supporter],
    ['Sender Address', data.sender_address], ['Sender Phone', data.sender_phone],
    ['Recipient Address', data.recipient_address], ['Recipient Phone', data.recipient_phone],
    ['Remark', data.remark],
  ];

  let imagesHTML = '';
  const imageFields = [
    ['ID Card', data.id_card_image], ['Profile', data.profile_image],
    ['Sender', data.sender_image], ['Recipient', data.recipient_image],
  ];
  for (const [label, url] of imageFields) {
    if (url) {
      const d = await toDataURL(url);
      if (d) imagesHTML += `<div style="display:inline-block;margin:6px;text-align:center"><img src="${d}" style="max-height:140px;border-radius:8px"/><div style="font-size:10px;color:#888;margin-top:3px">${label}</div></div>`;
    }
  }

  openPrintWindow('Client — ' + (data.name || ''), fields, imagesHTML ? `<div style="margin-top:16px;padding-top:12px;border-top:1px solid #e0d8d0"><div style="font-size:13px;font-weight:700;margin-bottom:8px">Images</div>${imagesHTML}</div>` : '', logoBase64);
}

export async function printNotePDF(data) {
  const logoBase64 = await toDataURL('/logo.png') || '';
  const fields = [
    ['Date', data.date], ['Topic', data.topic],
    ['Type', data.type], ['Description', data.description],
  ];

  let imagesHTML = '';
  if (data.images && data.images.length > 0) {
    for (const url of data.images) {
      const d = await toDataURL(url);
      if (d) imagesHTML += `<div style="display:inline-block;margin:6px"><img src="${d}" style="max-height:160px;border-radius:8px"/></div>`;
    }
  }

  openPrintWindow('Note — ' + (data.topic || ''), fields, imagesHTML ? `<div style="margin-top:16px;padding-top:12px;border-top:1px solid #e0d8d0"><div style="font-size:13px;font-weight:700;margin-bottom:8px">Images</div>${imagesHTML}</div>` : '', logoBase64);
}

export async function printInvoicePDF(ef) {
  const logoBase64 = await toDataURL('/logo.png') || '';
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
  const priceLine = (parseFloat(ef.price_per_kg)||0) * (parseFloat(ef.weight_result)||0);
  const diffLine = (parseFloat(ef.price_per_diff)||0) * (parseFloat(ef.weight_diff)||0);

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Receipt — ${ef.order_code || ''}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Poppins','Noto Sans Thai',sans-serif;background:#fff;color:#222;padding:40px 48px;font-size:12px;max-width:800px;margin:0 auto}
@media print{body{padding:20px 28px}@page{margin:12mm}}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px}
.header-left h1{font-size:22px;font-weight:700;color:#222;margin:0;line-height:1.2}
.header-left h2{font-size:14px;font-weight:400;color:#555;margin:0}
.header-right{text-align:right}
.header-right img{height:52px;object-fit:contain}
.header-right .co-name{font-size:16px;font-weight:700;color:#2d1b4e;margin-top:4px}
.header-right .co-sub{font-size:10px;color:#9b6ddb}
.info-section{margin:20px 0;padding:16px 0}
.info-row{display:flex;margin-bottom:4px;font-size:12px}
.info-label{width:100px;font-weight:600;color:#555;flex-shrink:0}
.info-value{flex:1;color:#222}
.info-cols{display:flex;gap:40px}
.info-col{flex:1}
.divider{border:none;border-top:1px dotted #999;margin:16px 0}
.divider-bold{border:none;border-top:2px solid #222;margin:16px 0}
table.items{width:100%;border-collapse:collapse;margin:16px 0}
table.items th{border:1px solid #333;padding:8px 10px;font-size:10px;font-weight:700;text-align:center;background:#f8f8f8}
table.items td{border:1px solid #ccc;padding:8px 10px;font-size:11px;text-align:center}
table.items td:nth-child(2){text-align:left}
.totals{margin-top:0}
.total-row{display:flex;justify-content:flex-end;align-items:center;padding:4px 0;font-size:12px}
.total-row .t-label{text-align:right;min-width:200px;padding-right:16px;font-weight:600}
.total-row .t-value{min-width:120px;text-align:right;padding-right:8px}
.total-row.grand{font-size:15px;font-weight:700;border-top:2px solid #222;padding-top:8px;margin-top:4px}
.note-label{font-size:11px;font-weight:700;color:#555;margin-top:16px}
.bottom-section{display:flex;justify-content:space-between;margin-top:40px;padding-top:16px;border-top:1px solid #ccc}
.sign-box{text-align:center;width:180px}
.sign-box .sign-line{border-bottom:1px dotted #999;margin-bottom:4px;height:40px}
.sign-box .sign-label{font-size:10px;color:#888}
.footer{margin-top:24px;text-align:center;font-size:9px;color:#aaa}
</style></head><body>

<div class="header">
  <div class="header-left">
    <h1>ใบเสร็จรับเงิน</h1>
    <h2>Receipt</h2>
  </div>
  <div class="header-right">
    <img src="${logoBase64}" alt="Logo" />
    <div class="co-name">${LOGO_TEXT}</div>

  </div>
</div>

<div class="info-section">
  <div class="info-cols">
    <div class="info-col">
      <div class="info-row"><span class="info-label">ลูกค้า:</span><span class="info-value">${ef.client || '-'}</span></div>
      <div class="info-row"><span class="info-label">เส้นทาง:</span><span class="info-value">${ef.origin_destination || '-'}</span></div>
      <div class="info-row"><span class="info-label">ประเภท:</span><span class="info-value">${ef.type_box || '-'}</span></div>
      <div class="info-row"><span class="info-label">บริการ:</span><span class="info-value">${ef.service_type || '-'}</span></div>
    </div>
    <div class="info-col">
      <div class="info-row"><span class="info-label">เลขที่:</span><span class="info-value" style="font-weight:700;color:#c0392b">${ef.order_code || '-'}</span></div>
      <div class="info-row"><span class="info-label">วันที่:</span><span class="info-value">${dateStr}</span></div>
      <div class="info-row"><span class="info-label">วันส่งออก:</span><span class="info-value">${ef.export_date || '-'}</span></div>
    </div>
  </div>
</div>

<hr class="divider" />

<table class="items">
  <thead><tr>
    <th style="width:50px">ลำดับที่</th>
    <th>รายละเอียด</th>
    <th style="width:70px">จำนวน</th>
    <th style="width:90px">น้ำหนัก (kg)</th>
    <th style="width:90px">ราคาต่อหน่วย</th>
    <th style="width:100px">รวมเป็นเงิน</th>
  </tr></thead>
  <tbody>
    <tr>
      <td>1</td>
      <td style="text-align:left">ค่าขนส่ง (Price/kg × Weight Result)</td>
      <td>${ef.total_boxes || 0} box</td>
      <td>${fmtN(ef.weight_result)}</td>
      <td>${fmtN(ef.price_per_kg)}</td>
      <td>${fmtN(priceLine)}</td>
    </tr>
    ${diffLine > 0 ? `<tr>
      <td>2</td>
      <td style="text-align:left">ค่าส่วนต่างน้ำหนัก (Price/diff × Weight Diff)</td>
      <td>-</td>
      <td>${fmtN(ef.weight_diff)}</td>
      <td>${fmtN(ef.price_per_diff)}</td>
      <td>${fmtN(diffLine)}</td>
    </tr>` : ''}
    <tr><td colspan="6" style="height:40px;border-bottom:1px solid #ccc">&nbsp;</td></tr>
    <tr><td colspan="6" style="height:40px;border-bottom:1px solid #ccc">&nbsp;</td></tr>
  </tbody>
</table>

<div class="totals">
  <div style="display:flex">
    <div style="flex:1"><span class="note-label">หมายเหตุ:</span><div style="font-size:10px;color:#888;margin-top:4px">${ef.remark || '-'}</div></div>
    <div style="min-width:300px">
      <div class="total-row"><span class="t-label">ราคารวมสินค้า (บาท)</span><span class="t-value">${fmtN(ef.total_thb)}</span></div>
      <div class="total-row"><span class="t-label">อื่นๆ</span><span class="t-value">0.00</span></div>
      <div class="total-row grand"><span class="t-label">จำนวนเงินรวมทั้งสิ้น (บาท)</span><span class="t-value" style="color:#c0392b">${fmtN(ef.total_thb)}</span></div>
      ${parseFloat(ef.total_mnt) > 0 ? `<div class="total-row" style="margin-top:6px"><span class="t-label">จำนวนเงิน MNT</span><span class="t-value" style="color:#2c6ea0;font-weight:700">₮ ${fmtN(ef.total_mnt)}</span></div>` : ''}
    </div>
  </div>
</div>

<div class="bottom-section">
  <div>
    <div style="font-size:10px;font-weight:700;color:#555;margin-bottom:8px">ข้อมูลการชำระเงิน:</div>
    <div style="font-size:10px;color:#666;line-height:1.8">
      □ เงินสด &nbsp;&nbsp; □ เงินโอน &nbsp;&nbsp; □ อื่นๆ<br/>
      รายละเอียดเพิ่มเติม .......................................
    </div>
  </div>
  <div class="sign-box">
    <div class="sign-line"></div>
    <div class="sign-label">อนุมัติโดย</div>
    <div style="font-size:9px;color:#aaa;margin-top:2px">วันที่ .................................</div>
  </div>
  <div class="sign-box">
    <div class="sign-line"></div>
    <div class="sign-label">รับชำระเงิน</div>
    <div style="font-size:9px;color:#aaa;margin-top:2px">วันที่ .................................</div>
  </div>
</div>

<div class="footer">${LOGO_TEXT}</div>
<script>window.onload=function(){window.print()}</script>
</body></html>`;

  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(html);
  w.document.close();
}

function openPrintWindow(title, fields, extraHTML, logoBase64) {
  const rows = fields.map(([label, val]) => {
    const v = val || '-';
    return `<tr><td style="padding:8px 12px;font-size:11px;font-weight:600;color:#7c4dbd;width:160px;vertical-align:top;border-bottom:1px solid #f0ebe5">${label}</td><td style="padding:8px 12px;font-size:12px;color:#2d1b4e;border-bottom:1px solid #f0ebe5;white-space:pre-wrap">${v}</td></tr>`;
  }).join('');

  const logoHTML = logoBase64 ? `<img src="${logoBase64}" style="height:44px;object-fit:contain" />` : `<div style="width:44px;height:44px;background:#2d1b4e;border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:16px">ME</div>`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Poppins',sans-serif;background:#fff;color:#2d1b4e;padding:32px}
@media print{body{padding:16px}@page{margin:12mm}}
</style></head><body>
<div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #2d1b4e">
  ${logoHTML}
  <div><div style="font-size:18px;font-weight:700;color:#2d1b4e">${LOGO_TEXT}</div><div style="font-size:11px;color:#9b6ddb;font-weight:500">${title}</div></div>
  <div style="margin-left:auto;font-size:10px;color:#a09890">Printed: ${new Date().toLocaleString()}</div>
</div>
<table style="width:100%;border-collapse:collapse">${rows}</table>
${extraHTML}
<script>window.onload=function(){window.print()}</script>
</body></html>`;

  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(html);
  w.document.close();
}
