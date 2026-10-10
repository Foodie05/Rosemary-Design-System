import { useState } from "react";
import { useReducedMotion } from "../../context/MotionPreferences";
import { Button, Modal } from "../ui/core";
import { Presence } from "../ui/Presence";
import { SwitchExample } from "../ui/inputs";
import { Tabs } from "../ui/navigation";
import { AccordionExample } from "../ui/layout";
export function MotionSamples() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false),
    [notice, setNotice] = useState(false);
  return (
    <div className="r-motion-samples">
      <p role="status">
        当前动态效果：{reduced ? "减少动态效果" : "标准反馈"}
        。网站底部的设置同时应用到所有演示。
      </p>
      <div>
        <h3>即时状态与连续切换</h3>
        <SwitchExample />
        <Tabs />
      </div>
      <div>
        <h3>展开与反向收起</h3>
        <AccordionExample />
      </div>
      <div>
        <h3>浮层与即时关闭</h3>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          重播弹窗动效
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="动效与操作同步"
        >
          <p>可以立即关闭，再次打开；无需等待动效结束。</p>
          <Button onClick={() => setOpen(false)}>关闭示例弹窗</Button>
        </Modal>
      </div>
      <div>
        <h3>占位与重新显示</h3>
        <Button
          variant="secondary"
          aria-expanded={notice}
          onClick={() => setNotice(!notice)}
        >
          {notice ? "收起状态说明" : "显示状态说明"}
        </Button>
        <Presence open={notice} collapse>
          <p>这条说明展开时保留空间关系，收起时立即停止交互。</p>
        </Presence>
      </div>
    </div>
  );
}
