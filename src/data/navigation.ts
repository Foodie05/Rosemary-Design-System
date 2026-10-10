import type { SectionId, NavItem } from "../types";
export const NAV_GROUPS: {
  title: string;
  links: [SectionId, string, string][];
}[] = [
  {
    title: "认识 Rosemary",
    links: [
      ["overview", "概览", "Overview"],
      ["philosophy", "设计哲学", "Philosophy"],
      ["brand", "品牌语言", "Brand"],
      ["foundations", "设计基础", "Foundations"],
    ],
  },
  {
    title: "构建体验",
    links: [
      ["components", "组件库", "Components"],
      ["dodont", "案例指南", "Field guide"],
      ["patterns", "交互模式", "Patterns"],
      ["tokens", "设计令牌", "Tokens"],
    ],
  },
  {
    title: "面向每一个人",
    links: [
      ["platforms", "跨平台指南", "Platforms"],
      ["accessibility", "无障碍", "Accessibility"],
      ["content", "内容与文案", "Content"],
      ["ai-guide", "AI 编程指南", "Agent guide"],
      ["governance", "规范治理", "Governance"],
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) =>
  group.links.map(([id, title, subtitle]) => ({
    id,
    section: id,
    title,
    subtitle,
  })),
);
