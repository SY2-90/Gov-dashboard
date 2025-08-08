document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/checkups')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('table tbody');
      tbody.innerHTML = ''; // 기존 내용 비우기

      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-200 hover:bg-sky-50 transition-colors cursor-pointer';
        tr.innerHTML = `
          <td class="py-3 px-6 font-medium">${item.site}</td>
          <td class="py-3 px-6">${item.date}</td>
          <td class="py-3 px-6 ${item.status === '완료' ? 'text-emerald-600' : 'text-rose-600'} font-semibold">${item.status}</td>
          <td class="py-3 px-6">${item.note}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('데이터 로드 실패', err));
});