(() => {
  const {icon,brandLockup} = window.RosemaryUI;
  const {sections,renderers,jump} = window.RosemaryPages;

  sections.overview = [
    jump('start-roles','从这里开始'),
    jump('explore','规范结构'),
    jump('resources','常用工具')
  ];

  const componentIllustration = `
    <span class="forma-path-art" aria-hidden="true">
      <svg class="forma-build-illustration" viewBox="0 0 640 300" fill="none">
        <rect class="forma-build-frame" x="70" y="28" width="500" height="244" rx="20"/>
        <path class="forma-build-frame" d="M70 91h500M205 91v181"/>
        <circle class="forma-build-plum" cx="104" cy="59" r="6"/>
        <circle class="forma-build-sun" cx="126" cy="59" r="6"/>
        <circle class="forma-build-sky" cx="148" cy="59" r="6"/>
        <path class="forma-build-muted" d="M101 126h73M101 151h49M101 176h62M101 226h78"/>
        <rect class="forma-build-sky-fill" x="239" y="121" width="119" height="76" rx="12"/>
        <rect class="forma-build-frame" x="382" y="121" width="153" height="76" rx="12"/>
        <path class="forma-build-plum" d="M263 221h186"/>
        <path class="forma-build-muted" d="M263 241h124"/>
        <rect class="forma-build-plum-fill" x="462" y="218" width="73" height="30" rx="8"/>
        <path class="forma-build-sun" d="M334 63h76"/>
        <path class="forma-build-sky" d="M432 63h70"/>
      </svg>
    </span>`;

  const routeLink = (href,label,title,description,extra='',art='') => `
    <a class="forma-path ${extra}" href="#/${href}">
      ${art}
      <span class="forma-path-label">${label}</span>
      <span class="forma-path-copy"><strong>${title}</strong><small>${description}</small></span>
      <span class="forma-path-arrow" aria-hidden="true">${icon('arrow')}</span>
    </a>`;

  renderers.overview = () => `
    <article class="page forma-home" data-page="overview">
      <header class="forma-hero">
        <div class="forma-hero-copy">
          <div class="forma-hero-brand">${brandLockup('forma',{size:64,className:'forma-lockup'})}</div>
          <p class="forma-eyebrow">ROSEMARY FORMA · 设计系统 1.3</p>
          <h1 class="forma-title" tabindex="-1">向所有 Rosemary 产品用户<br>传递稳定、可靠、一致的体验</h1>
          <p class="forma-lede">Forma 是 Rosemary 团队的设计系统。无论打造哪一款产品，我们都遵循统一的视觉风格、交互逻辑与技术标准，让用户无论打开哪个软件，都感到熟悉、好用。</p>
          <div class="forma-actions">
            <a class="button primary" href="#/components">浏览组件规范</a>
            <a class="button secondary" href="#/cases">查看典型案例</a>
          </div>
        </div>
        <div class="forma-composition" aria-hidden="true">
          <div class="forma-sheet forma-sheet-back"></div>
          <div class="forma-sheet forma-sheet-front">
            <span class="forma-shape forma-shape-round"></span>
            <span class="forma-shape forma-shape-square"></span>
            <i class="forma-rule forma-rule-wide"></i>
            <i class="forma-rule forma-rule-mid"></i>
            <i class="forma-rule forma-rule-short"></i>
            <span class="forma-control"></span>
          </div>
          <span class="forma-axis forma-axis-x"></span>
          <span class="forma-axis forma-axis-y"></span>
        </div>
      </header>

      <nav class="forma-contents" aria-label="首页内容">
        <span>概览导引</span>
        ${sections.overview.map(item=>`<a href="#/overview?section=${item.id}">${item.name}</a>`).join('')}
      </nav>

      <section class="forma-section forma-principles" id="start-roles" aria-labelledby="forma-start-roles-title">
        <div class="forma-section-heading">
          <p class="forma-section-index">01</p>
          <div><h2 id="forma-start-roles-title">根据你的工作快速上手</h2></div>
        </div>
        <ol class="forma-principle-list">
          <li>
            <span>01 / 品牌与新产品</span>
            <h3>规划新产品或品牌改版</h3>
            <p>先确定产品命名规范、Logo 组合方式与专属主题配色，为后续界面打好基础。</p>
            <div class="forma-role-links">
              <a class="forma-role-link" href="#/subbrand">查看子品牌流程${icon('arrow')}</a>
            </div>
          </li>
          <li>
            <span>02 / 界面设计</span>
            <h3>查阅视觉样式与交互规格</h3>
            <p>日常做设计直接查色彩色值、字号间距，以及 33 个常用组件的状态与交互细节。</p>
            <div class="forma-role-links">
              <a class="forma-role-link" href="#/components">查看组件规范${icon('arrow')}</a>
            </div>
          </li>
          <li>
            <span>03 / 研发接入</span>
            <h3>接入前端 SDK 与交付验收</h3>
            <p>获取 React、Compose、SwiftUI 与 Flutter 四端 SDK 代码包，并按照无障碍标准验收。</p>
            <div class="forma-role-links">
              <a class="forma-role-link" href="#/sdk">查看 SDK 接入指南${icon('arrow')}</a>
            </div>
          </li>
        </ol>
      </section>

      <section class="forma-section forma-explore" id="explore" aria-labelledby="forma-explore-title">
        <div class="forma-section-heading">
          <p class="forma-section-index">02</p>
          <div><h2 id="forma-explore-title">规范包含的核心内容</h2></div>
        </div>
        <div class="forma-paths">
          ${routeLink('components','组件 · 33 类','组件规范','按钮、表单、弹窗等基础组件的样式、各种状态、键盘操作与推荐做法。','forma-path-featured',componentIllustration)}
          ${routeLink('cases','案例 · 完整界面','典型案例','在音乐、登录、用户管理等真实界面中，看组件如何组合与自适应排版。','forma-path-case')}
          ${routeLink('colors','基础 · 视觉体系','视觉基础','色彩搭配、字体排版、间距尺度与界面层次划分。')}
          ${routeLink('patterns','交互 · 流程体验','交互与实施','保存与同步、删除与撤销、网络异常恢复及多端适配准则。')}
        </div>
      </section>

      <section class="forma-section forma-start" id="resources" aria-labelledby="forma-resources-title">
        <div class="forma-start-copy">
          <p class="forma-section-index">03</p>
          <h2 id="forma-resources-title">常用设计工具与资产</h2>
          <p>不用每次通读规范文档。调整主题配色、挑图标、下载官方 Logo 或导出 Token 代码，随时从这里直接获取。</p>
          <a class="forma-inline-link" href="#/governance?section=resources">查看全部下载资源与规范检查清单${icon('arrow')}</a>
        </div>
        <div class="forma-resources" aria-label="常用工具与资产">
          <p class="forma-resource-title">常用工具与资产直达</p>
          <a href="#/colors?section=studio"><span>${icon('palette')}调色盘与对比度检测工具</span>${icon('chevron')}</a>
          <a href="#/icons"><span>${icon('grid')}74 枚矢量 SVG 图标库</span>${icon('chevron')}</a>
          <a href="#/identity"><span>${icon('leaf')}官方 Logo 与品牌素材</span>${icon('chevron')}</a>
          <a href="#/governance?section=resources"><span>${icon('download')}设计 Token（JSON）与离线规范包</span>${icon('chevron')}</a>
        </div>
      </section>
    </article>`;
})();
