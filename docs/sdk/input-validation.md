# 字段校验与密码策略

SDK 0.5.0 候选在 React、Compose、SwiftUI、Flutter 的单行、多行输入中提供相同的字段要求机制。旧 `error` 参数继续用于身份服务、网络或业务返回的明确错误，不受本地首次脱焦计时限制。不要在宿主渲染时把尚未编辑的空字段转换为 `error`。

## 状态和位置

要求在开始编辑前显示于字段下方。只有聚焦后的首次非空脱焦才显示逐条结果；此后随输入更新，输入法组合阶段不展示中间结果。清空后恢复中性，清除全部勾叉及本地错误轮廓，下一次输入重新等待脱焦。程序填入非空值不会自行触发首次检查。字段值始终由宿主控制，SDK 不擅自 trim、改写、截断或提交。

每条要求用独立且稳定的 ID、可读标签、纯检查函数描述。规则满足显示单个勾；不满足显示单个叉和危险色，并以 1.5 个逻辑单位的紧贴细线标记字段。规则说明使用 14 个逻辑单位的字号并支持多行。可访问描述或相邻语义提供文字要求与状态，不仅依赖颜色。

`verification` 是同一字段的就近插槽：放置验证码、CAPTCHA、待验证、失败、重试及恢复操作。它位于输入与规则之后，不能把前置验证移到页面顶部或远处。宿主接入真实验证服务并控制提交；插槽本身不内置 CAPTCHA 提供商，不触发网络请求。

## 平台 API

| 平台    | 输入属性                                                                                  | 密码创建要求                                       |
| ------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| React   | `requirements: FieldRequirement[]`、`verification: ReactNode`                             | `passwordRequirements("en" / "zh")`                |
| Compose | `requirements: List<RosemaryFieldRequirement>`、`verification: (@Composable () -> Unit)?` | `RosemaryFieldRequirement.password(locale = "en")` |
| SwiftUI | `requirements: [RosemaryFieldRequirement]`、`verification: AnyView?`                      | `RosemaryFieldRequirement.password(locale: "en")`  |
| Flutter | `requirements: List<RosemaryFieldRequirement>`、`verification: Widget?`                   | `RosemaryFieldRequirement.password(locale: 'en')`  |

SwiftUI 会观测所属原生字段的 marked-text 通知；若宿主还包装自己的输入法桥接，可额外传入 `isComposing`，与 SDK 检测结果取并集。Compose 保留 `TextFieldValue.composition`，Flutter 保留编辑控制器的 composing range，React 使用 composition 事件。禁用、只读和宿主的受控值仍按原组件约定工作。

```tsx
<Input
  label="Create password"
  type="password"
  autoComplete="new-password"
  value={password}
  onValueChange={setPassword}
  requirements={passwordRequirements("en")}
  verification={challenge}
/>
```

```kotlin
RosemaryInput(password, { password = it }, "Create password", password = true,
    requirements = RosemaryFieldRequirement.password(), verification = { Challenge() })
```

```swift
RosemaryInput("Create password", text: $password, secure: true,
  requirements: RosemaryFieldRequirement.password(), verification: AnyView(Challenge()))
```

```dart
RosemaryInput(label: 'Create password', value: password, onChanged: update,
  password: true, requirements: RosemaryFieldRequirement.password(), verification: challenge)
```

## 密码与提交

`design/input-validation.json` 生成四端纯检查器：Web/React 的 `checkRosemaryPassword`，以及三个原生平台的 `RosemaryPasswordPolicy.check`。结果为 `length`、`characters`、`categories`、`valid`。

创建、设置、重置密码统一要求 8–32 个字符，只接受 U+0021–U+007E 可打印 ASCII，并至少包含英文字母、数字、英文标点中的两类。大小写同属字母。空格、控制符、emoji 和其他 Unicode 不接受；不得 trim、规范化或截断。登录只验证非空，不用新建密码复杂度限制既有凭据。

宿主用纯检查器决定是否允许提交，同时保留服务端对原始输入的权威校验；字段提示的中性状态不等于允许提交。昵称规则来自具体产品，不能套用密码的 ASCII 限制。
