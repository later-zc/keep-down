# 解决 PowerShell 中 `git stash apply stash@{0}` 报错 “unknown switch 'e'” 的问题

## 前言

在 PowerShell 命令行窗口中，执行 `git stash apply stash@{0}` 时，可能会遇到如下错误：

```bash
error: unknown switch 'e'
usage: git stash apply [--index] [-q|--quiet] [<stash>]
```

这个错误提示表明 `git stash apply` 命令中的 `stash@{0}` 被错误地解释为一个无效的选项。

## 原因

PowerShell 将 `@{}` 解析为哈希表的语法。由于 PowerShell 对 `@{}` 的处理不同于其他终端，它会将 `@{}` 作为哈希表的标识符处理，从而导致 `git stash apply` 命令中的 `stash@{0}` 被错误解析为选项或参数的一部分，导致命令报错。

具体来说，PowerShell 可能将 `stash@{0}` 解释为 `stash` 命令的一个开关（如 `-e`），从而导致 "unknown switch 'e'" 错误。

## 解决方案

为了让 PowerShell 正确解析 `stash@{0}`，可以使用引号将其括起来。这会告诉 PowerShell 将 `stash@{0}` 作为一个完整的字符串处理，而不是尝试解析其中的 `@{}` 作为哈希表的语法。你可以按照以下两种方式之一进行操作：

### 方式一：使用双/单引号

```powershell
git stash apply "stash@{0}"
git stash apply 'stash@{0}'
```

### 方式二：使用转义字符

另一种方式是使用转义字符，这在 PowerShell 中不是必须的，但有时也会用到：

```powershell
git stash apply stash`@{0}`
```

使用引号或转义字符后，PowerShell 会将 `stash@{0}` 作为一个单一的字符串传递给 `git` 命令，而不会进行哈希表解析，从而避免错误。


## 总结

在 PowerShell 中，`@{}` 符号被解释为哈希表的语法，这可能导致 `git stash apply stash@{0}` 命令中的 `stash@{0}` 被误解为无效的选项。使用引号（双引号或单引号）或转义字符可以确保 PowerShell 将其正确处理为字符串，从而避免解析错误。


## 相关资料

- [PowerShell 哈希表语法](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_operators?view=powershell-7.4#hash-table-literal-syntax-)
- [PowerShell 哈希表介绍](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_hash_tables?view=powershell-7.4)





