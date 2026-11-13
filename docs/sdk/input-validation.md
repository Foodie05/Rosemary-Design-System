# 字段校验与密码策略

`design/input-validation.json` 是密码规则与时机、位置要求的共享来源。`pnpm design:generate` 生成 Web/React、Compose、SwiftUI、Flutter 的纯密码检查器；`pnpm design:check` 检查是否漂移。

| 平台 | API |
| --- | --- |
| Web / React | `checkRosemaryPassword(value)`，从 `@rosemary-ui/tokens` 或 `@rosemary-ui/react` 导入 |
| SwiftUI | `RosemaryPasswordPolicy.check(value)` |
| Compose | `RosemaryPasswordPolicy.check(value)` |
| Flutter | `RosemaryPasswordPolicy.check(value)` |

结果包含 `length`、`characters`、`categories` 和 `valid`。只检查原始字符串，不做 trim、改写或截断。空格、非 ASCII 字符、emoji 与控制字符均不接受；长度为 8–32；英文字母、数字、ASCII 标点至少两类。大小写同属字母一类。各检查器同时提供一致的三条要求文案。

这些是纯策略检查器，不会自动决定 UI 何时变红。消费端必须先显示字段下方的要求，并在第一次非空脱焦后显示逐条结果，此后实时更新；清空后清除所有对错和红色描边，恢复首次脱焦的时机。输入法组合期间等待组合结束。要求、错误、验证码／CAPTCHA、重试及恢复都留在相关字段下方，不能挪到远处。

门户已提供此交互原型。原生应用接入时需要按以上状态契约绑定自己的表单状态；此变更不代表已修改任何身份服务的服务端校验。注册、设置与重置采用创建密码规则；登录不额外拒绝既有凭据的复杂度。
