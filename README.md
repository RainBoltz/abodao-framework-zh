<p align="center">
<img src="/aboDAOLogo.png" alt="aboDAOLogo" style="width: 30%;">
<p>

<h1 align="center">🔵🔵🔵 abo DAO Framework 🔵🔵🔵</h1>
<div align="center">

[![License](https://img.shields.io/github/license/fatfingererr/abodao-framework-zh)](https://github.com/fatfingererr/abodao-framework-zh/blob/master/LICENSE.md)

</div>
<p>aboDAO Framework 是一個 Imapct DAO 的 Solidity 合約框架，方便快速集資、管理與發放補助 (Grant)。受到 Moloch DAO 啟發，aboDAO 包含了一個特殊但簡單明瞭的治理結構，來協助任何專案輕鬆發起一個 Grant-making DAO。</p>
<br/>

- [快速開始](#快速開始)
  - [系統需求](#系統需求)
  - [執行佈署](#執行佈署)
- [aboDAO 簡介](#aboDAO-簡介)
  - [什麼是 Impact DAO？](#什麼是-Impact-DAO)
  - [特色功能](#特色功能)
  - [誰需要使用 aboDAO？](#誰需要使用-aboDAO)
  - [aboDAO 不是什麼](#aboDAO-不是什麼)
  - [這個工具是怎麼來的](#這個工具是怎麼來的)
  - [為什麼要開源？](#為什麼要開源)  
- [技術文件](#技術文件)
  - [使用手冊](#使用手冊)  
  - [aboDAO Wiki](#aboDAO-Wiki)
- [參與貢獻](#參與貢獻)
  - [協助推廣、測試與使用](#協助推廣測試與使用)
  - [協助開發與維護](#協助開發與維護)
- [聯絡](#聯絡)
- [貢獻者](#貢獻者)
- [支持](#支持)
- [開源條款](#開源條款)

<br/>

## 快速開始

```sh
git clone https://github.com/fatfingererr/abodao-framework-zh
cd abodao-framework-zh
npm install
npm run compile
```

## 執行佈署

請根據 `.env.example` 建立 `.env` 檔案，並填入對應參數

```sh
cp .env.example .env
gedit .env
```

### 佈署 AboDAO 與 AboPool

```sh
npm run dao:deploy
npm run pool:deploy
npm run pool:activate
```

### aboDAO 指令

```sh
npm run compile
npm run dao:deploy
npm run dao:status
npm run dao:proposal:submit
npm run dao:proposal:vote
npm run dao:proposal:status
npm run dao:proposal:process
npm run dao:update-delegate
npm run dao:ragequit
npm run pool:deploy
npm run pool:activate
npm run pool:withdraw
npm run pool:deposit
npm run pool:status
npm run pool:add-keeper
npm run pool:remove-keeper
npm run pool:keeper-withdraw
```

### 注意事項

1. 如果 AboPool 資金池全部被 Withdraow, 則 Pool 就會回到 No Active 狀態, 需要重新 Activate
2. 同一個 Keeper 可以 add/remove 多次, 不會有任何 Error

## aboDAO 簡介

TBD

### 什麼是 Impact DAO？

TBD

### 特色功能

TBD

### 誰需要使用 aboDAO？

TBD

### aboDAO 不是什麼

TBD

### 這個工具是怎麼來的

TBD

### 為什麼要開源？

TBD

## 技術文件

### 合約驗證

```sh
npx hardhat verify <AbooDAO 合約地址> --network matic --constructor-args arguments/AboDAO.js
npx hardhat verify <AboPool 合約地址> --network matic --constructor-args arguments/AboPool.js
```
TBD

### 使用手冊

TBD

### aboDAO Wiki

TBD

## 參與貢獻

TBD

### 協助推廣、測試與使用

TBD

### 協助開發與維護

TBD

## 聯絡

TBD

## 貢獻者

TBD


## 支持

TBD

## 開源條款

MIT, aboDAO Copyright © 2022