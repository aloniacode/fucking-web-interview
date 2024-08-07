# Git

## `git pull`和`git fetch`的异同

它们都是从远程仓库获取更新的命令，区别在于：

`git pull`从远程仓库获取更新后会自动合并到当前分支，实际相当于`git fetch`和`git merge`的组合，如果存在冲突则需要手动完成`merge`。

`git fetch`从远程仓库获取更新后不会自动合并到当前分支，也就是它不会更改当前工作目录的内容。

## Git仓库如何迁移？

如果需要迁移仓库并且保留所有的分支、提交和标签，例如从github上迁移一个仓库A到gitlab平台上，并且gitlab平台已经创建一个空仓库B：

1. 使用`git clone`和`git push`。

```sh
// 本地克隆
git clone --mirror <A repository url>
// 修改远程仓库地址
git remote set-url --push origin <B repository url>
// 推送到B仓库
git push --mirror
```
2. 使用`git bundle`。

```sh
//在A仓库创建bundle文件
git bundle create repoA.bundle --all
// 将repoA.bundle文件上传到B仓库，在执行clone命令
git clone repoA.bundle <B repository Directory>
```
::: warning
请确保B仓库是空仓库，如果待迁移的仓库含有子模块，则需要额外处理子模块的迁移。
:::