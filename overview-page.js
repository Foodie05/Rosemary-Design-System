(() => {
  const {icon,brandLockup} = window.RosemaryUI;
  const {sections,renderers,jump} = window.RosemaryPages;

  sections.overview = [
    jump('principles','设计原则'),
    jump('explore','精选入口'),
    jump('start','起步与资源')
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
          <p class="forma-eyebrow">Rosemary 的设计规范</p>
          <h1 class="forma-title" tabindex="-1">让每一款 Rosemary 产品，<br>清楚、可靠、彼此一致。</h1>
          <p class="forma-lede">Rosemary Forma 汇集品牌、基础、组件和交互规范，帮助设计与开发在不同产品里做出一致、可实现、可访问的界面。</p>
          <div class="forma-actions">
            <a class="button primary" href="#/philosophy">开始使用规范</a>
            <a class="button secondary" href="#/cases">浏览典型案例</a>
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
        <span>探索 Forma</span>
        ${sections.overview.map(item=>`<a href="#/overview?section=${item.id}">${item.name}</a>`).join('')}
      </nav>

      <section class="forma-section forma-principles" id="principles" aria-labelledby="forma-principles-title">
        <div class="forma-section-heading">
          <p class="forma-section-index">01</p>
          <div><h2 id="forma-principles-title">规范从真实使用开始</h2><p>Forma 先统一判断依据，再统一颜色、间距和组件。</p></div>
        </div>
        <ol class="forma-principle-list">
          <li><span>01</span><h3>以任务为先</h3><p>让界面帮助用户完成当下的事，减少无关提醒、步骤和装饰。</p></li>
          <li><span>02</span><h3>说明真实状态</h3><p>清楚表达进度、结果和限制，不用情绪化文案代替事实。</p></li>
          <li><span>03</span><h3>保留选择与恢复</h3><p>尊重隐私与动态偏好，让中断、失败和误操作都有可行路径。</p></li>
        </ol>
      </section>

      <section class="forma-section forma-explore" id="explore" aria-labelledby="forma-explore-title">
        <div class="forma-section-heading">
          <p class="forma-section-index">02</p>
          <div><h2 id="forma-explore-title">从需要的层级进入</h2><p>先看可运行的组件与案例，也可以回到视觉基础和实施要求。</p></div>
        </div>
        <div class="forma-paths">
          ${routeLink('components','组件','组件规范','查看结构、状态、交互和实现要求。','forma-path-featured',componentIllustration)}
          ${routeLink('cases','案例','典型案例','在完整界面里检验组件组合与响应式表现。','forma-path-case')}
          ${routeLink('colors','基础','色彩与主题','理解语义色、字体、布局和视觉层级。')}
          ${routeLink('governance','实施','覆盖与维护','确认规范范围、资源、来源与发布检查。')}
        </div>
      </section>

      <section class="forma-section forma-start" id="start" aria-labelledby="forma-start-title">
        <div class="forma-start-copy">
          <p class="forma-section-index">03</p>
          <h2 id="forma-start-title">把共同规则带进下一次设计</h2>
          <p>先确认设计原则和任务边界，再选择合适的组件、状态与反馈。页面可以有自己的性格，基础行为应保持一致。</p>
          <a class="forma-inline-link" href="#/philosophy">阅读品牌与设计原则${icon('arrow')}</a>
        </div>
        <div class="forma-resources" aria-label="常用资源">
          <p class="forma-resource-title">常用资源</p>
          <a href="#/identity"><span>${icon('leaf')}Logo 与品牌资产</span>${icon('chevron')}</a>
          <a href="#/icons"><span>${icon('grid')}SVG 图标库</span>${icon('chevron')}</a>
          <a href="#/colors?section=tokens"><span>${icon('palette')}设计变量</span>${icon('chevron')}</a>
        </div>
      </section>
    </article>`;
})();
