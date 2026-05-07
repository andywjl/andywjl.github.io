/* ============================================================
   楼宇档案管理系统 — 主逻辑
   ============================================================ */

// ───── 示例楼宇数据 ─────
const BUILDING_ICONS = {
    '办公楼': '🏢',
    '商业综合体': '🏬',
    '产业园区': '🏭',
    '住宅小区': '🏠',
    '公共建筑': '🏛️',
};

let buildings = [
    { id: 1,  name: '国贸中心三期',      type: '办公楼',     district: '朝阳区',   address: '建国门外大街1号',      area: 540000, floors: 81, year: 2010, occupancy: 96, status: '在用',   owner: '中国国际贸易中心', desc: '北京最高的写字楼之一，地标性超甲级办公楼。' },
    { id: 2,  name: '望京SOHO',          type: '商业综合体', district: '朝阳区',   address: '望京街10号',           area: 521000, floors: 45, year: 2014, occupancy: 82, status: '在用',   owner: 'SOHO中国',        desc: '由扎哈·哈迪德设计的地标建筑群，含三栋塔楼。' },
    { id: 3,  name: '中关村软件园二期',   type: '产业园区',   district: '海淀区',   address: '东北旺西路8号',        area: 830000, floors: 12, year: 2008, occupancy: 91, status: '在用',   owner: '中关村发展集团',  desc: '聚集百度、腾讯等知名科技企业的国家级软件园。' },
    { id: 4,  name: '银河SOHO',          type: '商业综合体', district: '东城区',   address: '南竹杆胡同2号',        area: 330000, floors: 15, year: 2012, occupancy: 78, status: '在用',   owner: 'SOHO中国',        desc: '扎哈·哈迪德设计，流线型商业办公综合体。' },
    { id: 5,  name: '丽泽SOHO',          type: '办公楼',     district: '丰台区',   address: '丽泽路16号',           area: 172000, floors: 45, year: 2019, occupancy: 65, status: '在用',   owner: 'SOHO中国',        desc: '全球最高中庭建筑，双塔扭转结构。' },
    { id: 6,  name: '颐堤港',            type: '商业综合体', district: '朝阳区',   address: '酒仙桥路18号',         area: 226000, floors: 22, year: 2012, occupancy: 89, status: '在用',   owner: '太古地产',        desc: '集办公、购物、酒店于一体的综合体。' },
    { id: 7,  name: '首开·龙湖天璞',     type: '住宅小区',   district: '朝阳区',   address: '东坝南二街',           area: 150000, floors: 18, year: 2017, occupancy: 92, status: '在用',   owner: '首开龙湖',        desc: '高端住宅社区，配套完善。' },
    { id: 8,  name: '中关村壹号',        type: '产业园区',   district: '海淀区',   address: '北清路68号',           area: 280000, floors: 8,  year: 2020, occupancy: 73, status: '在用',   owner: '实创科技园',      desc: '定位人工智能和前沿科技产业基地。' },
    { id: 9,  name: '国家会议中心二期',   type: '公共建筑',   district: '朝阳区',   address: '天辰东路7号',          area: 410000, floors: 9,  year: 2025, occupancy: 0,  status: '在建',   owner: '北辰实业',        desc: '冬奥会遗产项目，未来亚洲最大会展综合体。' },
    { id: 10, name: '北京城市副中心站',   type: '公共建筑',   district: '通州区',   address: '杨坨地区',             area: 600000, floors: 5,  year: 2025, occupancy: 0,  status: '在建',   owner: '京投公司',        desc: '亚洲最大地下交通枢纽综合体。' },
    { id: 11, name: '万科翡翠书院',      type: '住宅小区',   district: '海淀区',   address: '永丰路附近',           area: 120000, floors: 12, year: 2019, occupancy: 88, status: '在用',   owner: '万科集团',        desc: '高品质租赁社区项目。' },
    { id: 12, name: '中国尊',            type: '办公楼',     district: '朝阳区',   address: '光华路12号',           area: 427000, floors: 108,year: 2018, occupancy: 72, status: '在用',   owner: '中信集团',        desc: '北京第一高楼（528米），CBD核心区标志建筑。' },
    { id: 13, name: '亦庄经开区E9区',    type: '产业园区',   district: '大兴区',   address: '经海三路',             area: 200000, floors: 6,  year: 2021, occupancy: 68, status: '在用',   owner: '亦庄控股',        desc: '智能制造产业集聚区。' },
    { id: 14, name: '西单大悦城',        type: '商业综合体', district: '西城区',   address: '西单北大街131号',      area: 140000, floors: 13, year: 2007, occupancy: 95, status: '在用',   owner: '中粮置地',        desc: '京城核心商圈标杆购物中心。' },
    { id: 15, name: '未来科学城',        type: '产业园区',   district: '昌平区',   address: '未来科学城路',         area: 960000, floors: 10, year: 2023, occupancy: 55, status: '在用',   owner: '未来科学城公司',  desc: '央企研发基地，定位能源与生命科学领域。' },
    { id: 16, name: '丰台科技园',        type: '产业园区',   district: '丰台区',   address: '科学城四街',           area: 350000, floors: 8,  year: 2015, occupancy: 81, status: '在用',   owner: '丰科建设',        desc: '军民融合科技产业园。' },
    { id: 17, name: '长安天街',          type: '商业综合体', district: '石景山区', address: '石景山路20号',         area: 190000, floors: 16, year: 2020, occupancy: 76, status: '在用',   owner: '龙湖集团',        desc: '西部新兴商业地标综合体。' },
    { id: 18, name: '首钢园区',          type: '产业园区',   district: '石景山区', address: '石景山路68号',         area: 720000, floors: 5,  year: 2022, occupancy: 60, status: '在用',   owner: '首钢集团',        desc: '冬奥遗产工业遗址改造科技园区。' },
    { id: 19, name: '副中心行政办公区',   type: '公共建筑',   district: '通州区',   address: '运河东大街',           area: 380000, floors: 12, year: 2019, occupancy: 98, status: '在用',   owner: '市机关事务局',    desc: '北京城市副中心核心功能区。' },
    { id: 20, name: '新首钢大桥TOD项目', type: '商业综合体', district: '石景山区', address: '新首钢大桥南侧',      area: 250000, floors: 25, year: 2027, occupancy: 0,  status: '规划中', owner: '首钢集团',        desc: '以轨道交通为导向的城市综合开发。' },
];

let nextId = 21;
let editingId = null;

// ───── DOM 引用 ─────
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const navItems = document.querySelectorAll('.nav-item');

const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const filterDistrict = document.getElementById('filterDistrict');
const filterStatus = document.getElementById('filterStatus');

const gridContainer = document.getElementById('buildingsGrid');
const listContainer = document.getElementById('buildingsList');
const tableBody = document.getElementById('buildingsTableBody');
const btnGridView = document.getElementById('btnGridView');
const btnListView = document.getElementById('btnListView');

const detailModal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

const formModal = document.getElementById('formModal');
const formModalClose = document.getElementById('formModalClose');
const formCancel = document.getElementById('formCancel');
const buildingForm = document.getElementById('buildingForm');
const formTitle = document.getElementById('formTitle');
const btnAddBuilding = document.getElementById('btnAddBuilding');

// ───── 初始化 ─────
document.addEventListener('DOMContentLoaded', () => {
    showDate();
    populateDistrictFilter();
    renderDashboard();
    renderBuildings();
    renderDistricts();
    renderAnalytics();
    bindEvents();
});

// ───── 日期显示 ─────
function showDate() {
    const d = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('currentDate').textContent = d.toLocaleDateString('zh-CN', opts);
}

// ───── 导航切换 ─────
function bindEvents() {
    // sidebar nav
    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            closeSidebar();
        });
    });

    // "查看全部" links
    document.querySelectorAll('[data-goto]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.dataset.goto;
            switchView(target);
            navItems.forEach(n => {
                n.classList.remove('active');
                if (n.dataset.view === target) n.classList.add('active');
            });
        });
    });

    // mobile menu
    menuToggle.addEventListener('click', toggleSidebar);

    // search & filters
    searchInput.addEventListener('input', renderBuildings);
    filterType.addEventListener('change', renderBuildings);
    filterDistrict.addEventListener('change', renderBuildings);
    filterStatus.addEventListener('change', renderBuildings);

    // view toggle
    btnGridView.addEventListener('click', () => {
        btnGridView.classList.add('active');
        btnListView.classList.remove('active');
        gridContainer.classList.remove('hidden');
        listContainer.classList.add('hidden');
    });
    btnListView.addEventListener('click', () => {
        btnListView.classList.add('active');
        btnGridView.classList.remove('active');
        listContainer.classList.remove('hidden');
        gridContainer.classList.add('hidden');
    });

    // detail modal
    modalClose.addEventListener('click', closeDetailModal);
    detailModal.addEventListener('click', e => {
        if (e.target === detailModal) closeDetailModal();
    });

    // form modal
    btnAddBuilding.addEventListener('click', () => openFormModal());
    formModalClose.addEventListener('click', closeFormModal);
    formCancel.addEventListener('click', closeFormModal);
    formModal.addEventListener('click', e => {
        if (e.target === formModal) closeFormModal();
    });
    buildingForm.addEventListener('submit', handleFormSubmit);

    // sidebar overlay
    let overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebarOverlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
}

function switchView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + name);
    if (target) target.classList.add('active');
    if (name === 'analytics') renderAnalytics();
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.classList.remove('open');
}

// ───── 区域筛选器填充 ─────
function populateDistrictFilter() {
    const districts = [...new Set(buildings.map(b => b.district))].sort();
    const sel = filterDistrict;
    districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        sel.appendChild(opt);
    });
}

// ───── Dashboard ─────
function renderDashboard() {
    const total = buildings.length;
    const active = buildings.filter(b => b.status === '在用').length;
    const totalArea = buildings.reduce((s, b) => s + b.area, 0);
    const avgOcc = Math.round(
        buildings.filter(b => b.status === '在用').reduce((s, b) => s + b.occupancy, 0) /
        (active || 1)
    );

    animateValue('statTotal', total);
    animateValue('statActive', active);
    animateValue('statArea', (totalArea / 10000).toFixed(1), true);
    animateValue('statOccupancy', avgOcc);

    renderRecentTable();
    renderTypeChart();
    renderDistrictChart();
}

function animateValue(id, target, isFloat = false) {
    const el = document.getElementById(id);
    const num = parseFloat(target);
    const duration = 1200;
    const start = performance.now();
    function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = num * eased;
        el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
        if (p < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function renderRecentTable() {
    const recent = [...buildings].sort((a, b) => b.id - a.id).slice(0, 5);
    const tbody = document.querySelector('#recentTable tbody');
    tbody.innerHTML = recent.map(b => `
        <tr>
            <td class="name-cell" onclick="openDetail(${b.id})">${b.name}</td>
            <td>${b.type}</td>
            <td>${b.district}</td>
            <td>${(b.area).toLocaleString()} ㎡</td>
            <td>${b.floors}F</td>
            <td><span class="status-badge status-${b.status}">${b.status}</span></td>
        </tr>
    `).join('');
}

// ───── Charts ─────
let chartInstances = {};

function destroyChart(key) {
    if (chartInstances[key]) {
        chartInstances[key].destroy();
        chartInstances[key] = null;
    }
}

const CHART_COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
];

function renderTypeChart() {
    destroyChart('type');
    const counts = {};
    buildings.forEach(b => { counts[b.type] = (counts[b.type] || 0) + 1; });
    const labels = Object.keys(counts);
    const data = Object.values(counts);

    chartInstances['type'] = new Chart(document.getElementById('chartType'), {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: CHART_COLORS.slice(0, labels.length),
                borderWidth: 0,
                hoverOffset: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, font: { size: 12 } } },
            },
            cutout: '60%',
        },
    });
}

function renderDistrictChart() {
    destroyChart('district');
    const counts = {};
    buildings.forEach(b => { counts[b.district] = (counts[b.district] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(s => s[0]);
    const data = sorted.map(s => s[1]);

    chartInstances['district'] = new Chart(document.getElementById('chartDistrict'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '楼宇数量',
                data,
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                maxBarThickness: 40,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f1f5f9' } },
                x: { ticks: { font: { size: 11 } }, grid: { display: false } },
            },
        },
    });
}

// ───── 楼宇列表 ─────
function getFilteredBuildings() {
    const q = searchInput.value.trim().toLowerCase();
    const t = filterType.value;
    const d = filterDistrict.value;
    const s = filterStatus.value;

    return buildings.filter(b => {
        if (q && !b.name.toLowerCase().includes(q) && !b.address.toLowerCase().includes(q)) return false;
        if (t && b.type !== t) return false;
        if (d && b.district !== d) return false;
        if (s && b.status !== s) return false;
        return true;
    });
}

function renderBuildings() {
    const list = getFilteredBuildings();
    document.getElementById('buildingCount').textContent = list.length;

    // grid
    gridContainer.innerHTML = list.length ? list.map(b => `
        <div class="building-card" onclick="openDetail(${b.id})">
            <div class="building-card-header">
                <div class="building-card-icon type-${b.type}">${BUILDING_ICONS[b.type] || '🏢'}</div>
                <div class="building-card-title">
                    <h3>${b.name}</h3>
                    <span class="card-type">${b.type}</span>
                </div>
                <span class="status-badge status-${b.status}">${b.status}</span>
            </div>
            <div class="building-card-body">
                <div class="card-meta">
                    <div class="card-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${b.district} · ${b.address}
                    </div>
                    <div class="card-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
                        ${b.area.toLocaleString()} ㎡ · ${b.floors} 层 · ${b.year || '—'}年
                    </div>
                </div>
            </div>
            <div class="building-card-footer">
                <div style="display:flex;align-items:center;gap:8px;flex:1">
                    <span style="font-size:0.75rem;color:var(--text-muted)">入驻率</span>
                    <div class="occupancy-bar">
                        <div class="occupancy-fill ${b.occupancy >= 80 ? 'high' : b.occupancy >= 50 ? 'medium' : 'low'}" style="width:${b.occupancy}%"></div>
                    </div>
                    <span class="occupancy-text">${b.occupancy}%</span>
                </div>
            </div>
        </div>
    `).join('') : '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>未找到匹配的楼宇</p></div>';

    // table
    tableBody.innerHTML = list.length ? list.map(b => `
        <tr>
            <td class="name-cell" onclick="openDetail(${b.id})">${b.name}</td>
            <td>${b.type}</td>
            <td>${b.district}</td>
            <td>${b.address}</td>
            <td>${b.area.toLocaleString()}</td>
            <td>${b.floors}F</td>
            <td>${b.year || '—'}</td>
            <td>${b.occupancy}%</td>
            <td><span class="status-badge status-${b.status}">${b.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation();openFormModal(${b.id})">编辑</button>
                <button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteBuilding(${b.id})" style="margin-left:4px">删除</button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-muted)">暂无数据</td></tr>';
}

// ───── 详情弹窗 ─────
function openDetail(id) {
    const b = buildings.find(x => x.id === id);
    if (!b) return;

    modalBody.innerHTML = `
        <div class="detail-header">
            <div class="detail-icon type-${b.type}" style="background: ${getTypeBg(b.type)}">${BUILDING_ICONS[b.type] || '🏢'}</div>
            <div class="detail-title">
                <h2>${b.name}</h2>
                <p>${b.type} · ${b.district}</p>
            </div>
            <span class="status-badge status-${b.status}" style="margin-left:auto">${b.status}</span>
        </div>
        <div class="detail-grid">
            <div class="detail-item"><span class="detail-item-label">详细地址</span><span class="detail-item-value">${b.district}${b.address}</span></div>
            <div class="detail-item"><span class="detail-item-label">建筑面积</span><span class="detail-item-value">${b.area.toLocaleString()} ㎡</span></div>
            <div class="detail-item"><span class="detail-item-label">楼层数</span><span class="detail-item-value">${b.floors} 层</span></div>
            <div class="detail-item"><span class="detail-item-label">建成年份</span><span class="detail-item-value">${b.year || '—'} 年</span></div>
            <div class="detail-item"><span class="detail-item-label">入驻率</span><span class="detail-item-value">${b.occupancy}%</span></div>
            <div class="detail-item"><span class="detail-item-label">产权方</span><span class="detail-item-value">${b.owner || '—'}</span></div>
        </div>
        ${b.desc ? `<div class="detail-desc"><h4>备注</h4><p>${b.desc}</p></div>` : ''}
        <div class="detail-actions">
            <button class="btn btn-outline" onclick="closeDetailModal();openFormModal(${b.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                编辑
            </button>
            <button class="btn btn-danger" onclick="closeDetailModal();deleteBuilding(${b.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                删除
            </button>
        </div>
    `;
    detailModal.classList.add('open');
}

function getTypeBg(type) {
    const map = { '办公楼':'#eff6ff','商业综合体':'#fffbeb','产业园区':'#ecfdf5','住宅小区':'#f5f3ff','公共建筑':'#fef2f2' };
    return map[type] || '#f8fafc';
}

function closeDetailModal() {
    detailModal.classList.remove('open');
}

// ───── 新增/编辑表单 ─────
function openFormModal(id) {
    editingId = id || null;
    formTitle.textContent = id ? '编辑楼宇' : '新增楼宇';

    if (id) {
        const b = buildings.find(x => x.id === id);
        if (!b) return;
        document.getElementById('fname').value = b.name;
        document.getElementById('ftype').value = b.type;
        document.getElementById('fdistrict').value = b.district;
        document.getElementById('faddress').value = b.address;
        document.getElementById('farea').value = b.area;
        document.getElementById('ffloors').value = b.floors;
        document.getElementById('fyear').value = b.year || '';
        document.getElementById('foccupancy').value = b.occupancy || '';
        document.getElementById('fstatus').value = b.status;
        document.getElementById('fowner').value = b.owner || '';
        document.getElementById('fdesc').value = b.desc || '';
    } else {
        buildingForm.reset();
    }

    formModal.classList.add('open');
}

function closeFormModal() {
    formModal.classList.remove('open');
    editingId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('fname').value.trim(),
        type: document.getElementById('ftype').value,
        district: document.getElementById('fdistrict').value.trim(),
        address: document.getElementById('faddress').value.trim(),
        area: Number(document.getElementById('farea').value),
        floors: Number(document.getElementById('ffloors').value),
        year: Number(document.getElementById('fyear').value) || null,
        occupancy: Number(document.getElementById('foccupancy').value) || 0,
        status: document.getElementById('fstatus').value,
        owner: document.getElementById('fowner').value.trim(),
        desc: document.getElementById('fdesc').value.trim(),
    };

    if (editingId) {
        const idx = buildings.findIndex(b => b.id === editingId);
        if (idx !== -1) buildings[idx] = { ...buildings[idx], ...data };
    } else {
        data.id = nextId++;
        buildings.push(data);
    }

    closeFormModal();
    refreshAll();
}

function deleteBuilding(id) {
    if (!confirm('确定要删除这栋楼宇档案吗？')) return;
    buildings = buildings.filter(b => b.id !== id);
    refreshAll();
}

function refreshAll() {
    renderDashboard();
    renderBuildings();
    renderDistricts();
    renderAnalytics();
}

// ───── 区域分布 ─────
function renderDistricts() {
    const groups = {};
    buildings.forEach(b => {
        if (!groups[b.district]) groups[b.district] = [];
        groups[b.district].push(b);
    });

    const grid = document.getElementById('districtGrid');
    grid.innerHTML = Object.entries(groups)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([district, list]) => {
            const totalArea = list.reduce((s, b) => s + b.area, 0);
            const activeList = list.filter(b => b.status === '在用');
            const avgOcc = activeList.length
                ? Math.round(activeList.reduce((s, b) => s + b.occupancy, 0) / activeList.length)
                : 0;
            return `
            <div class="district-card">
                <div class="district-card-header">
                    <h3>${district}</h3>
                    <span class="district-count">${list.length} 栋</span>
                </div>
                <div class="district-stats">
                    <div class="district-stat">
                        <span class="district-stat-value">${(totalArea / 10000).toFixed(1)}</span>
                        <span class="district-stat-label">总面积(万㎡)</span>
                    </div>
                    <div class="district-stat">
                        <span class="district-stat-value">${activeList.length}</span>
                        <span class="district-stat-label">在用</span>
                    </div>
                    <div class="district-stat">
                        <span class="district-stat-value">${avgOcc}%</span>
                        <span class="district-stat-label">平均入驻率</span>
                    </div>
                </div>
                <div class="district-buildings">
                    ${list.map(b => `<span class="district-tag" onclick="openDetail(${b.id})">${b.name}</span>`).join('')}
                </div>
            </div>`;
        }).join('');
}

// ───── 统计分析 ─────
function renderAnalytics() {
    renderYearChart();
    renderFloorsChart();
    renderOccupancyChart();
    renderAreaTopChart();
}

function renderYearChart() {
    destroyChart('year');
    const buckets = {};
    buildings.forEach(b => {
        if (!b.year) return;
        const decade = Math.floor(b.year / 5) * 5;
        const label = `${decade}-${decade + 4}`;
        buckets[label] = (buckets[label] || 0) + 1;
    });
    const sorted = Object.entries(buckets).sort((a, b) => a[0].localeCompare(b[0]));

    chartInstances['year'] = new Chart(document.getElementById('chartYear'), {
        type: 'bar',
        data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
                label: '楼宇数量',
                data: sorted.map(s => s[1]),
                backgroundColor: '#8b5cf6',
                borderRadius: 6,
                maxBarThickness: 36,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f1f5f9' } },
                x: { ticks: { font: { size: 11 } }, grid: { display: false } },
            },
        },
    });
}

function renderFloorsChart() {
    destroyChart('floors');
    const buckets = { '1-10层': 0, '11-20层': 0, '21-50层': 0, '50层以上': 0 };
    buildings.forEach(b => {
        if (b.floors <= 10) buckets['1-10层']++;
        else if (b.floors <= 20) buckets['11-20层']++;
        else if (b.floors <= 50) buckets['21-50层']++;
        else buckets['50层以上']++;
    });

    chartInstances['floors'] = new Chart(document.getElementById('chartFloors'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(buckets),
            datasets: [{
                data: Object.values(buckets),
                backgroundColor: ['#06b6d4', '#3b82f6', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 6,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, font: { size: 12 } } } },
            cutout: '60%',
        },
    });
}

function renderOccupancyChart() {
    destroyChart('occupancy');
    const buckets = { '0%': 0, '1-50%': 0, '51-80%': 0, '81-100%': 0 };
    buildings.forEach(b => {
        if (b.occupancy === 0) buckets['0%']++;
        else if (b.occupancy <= 50) buckets['1-50%']++;
        else if (b.occupancy <= 80) buckets['51-80%']++;
        else buckets['81-100%']++;
    });

    chartInstances['occupancy'] = new Chart(document.getElementById('chartOccupancy'), {
        type: 'pie',
        data: {
            labels: Object.keys(buckets),
            datasets: [{
                data: Object.values(buckets),
                backgroundColor: ['#94a3b8', '#f97316', '#3b82f6', '#10b981'],
                borderWidth: 0,
                hoverOffset: 6,
            }],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, font: { size: 12 } } } },
        },
    });
}

function renderAreaTopChart() {
    destroyChart('areaTop');
    const top = [...buildings].sort((a, b) => b.area - a.area).slice(0, 10);

    chartInstances['areaTop'] = new Chart(document.getElementById('chartAreaTop'), {
        type: 'bar',
        data: {
            labels: top.map(b => b.name.length > 8 ? b.name.slice(0, 8) + '…' : b.name),
            datasets: [{
                label: '建筑面积(万㎡)',
                data: top.map(b => (b.area / 10000).toFixed(1)),
                backgroundColor: '#10b981',
                borderRadius: 6,
                maxBarThickness: 36,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: true, ticks: { font: { size: 11 } }, grid: { color: '#f1f5f9' } },
                y: { ticks: { font: { size: 11 } }, grid: { display: false } },
            },
        },
    });
}
