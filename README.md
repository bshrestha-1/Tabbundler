# Contextual Tab Bundler – Firefox Extension

Firefox introduced **vertical sidebars for tab management** starting in version **136 (early 2025)**. This extension explores that capability by using a sidebar to automatically organize your open tabs into **topic-based groups** using lightweight AI classification.

## 🚀 Features

- 🔍 **Automatic Tab Grouping**  
  Tabs are classified into categories like _Research_, _Shopping_, _Learning_, _Entertainment_, and _News_ using smart keyword and domain heuristics.

- 🧠 **Context-Aware AI**  
  Goes beyond simple keyword matching. For example:
  - YouTube videos about tutorials, courses, or lectures are grouped under **Learning**
  - News articles on Amazon are placed under **News**, not **Shopping**

- 📚 **Sidebar UI**  
  Groups are displayed in a collapsible vertical sidebar. You can click to activate tabs or manually reassign them.

- 🛠️ **User Reassignment**  
  Easily reassign misclassified tabs to a new group right from the sidebar.

- 🌙 **Dark Mode**  
  The sidebar is styled for dark mode by default.

## 💡 Motivation

Firefox 136 enabled sidebar-based tab experiences. I wanted to explore this by building a custom extension that makes tab overload more manageable — especially useful when doing research, shopping, or binge-learning on YouTube.

## 📦 Installation

1. Go to `about:debugging` → **This Firefox**
2. Click **Load Temporary Add-on**
3. Select any file in the extension folder (e.g., `manifest.json`)
4. The sidebar icon will appear — click it and explore!

## 🛠️ Tech Stack

- Manifest V2 (for Firefox compatibility)
- Vanilla JavaScript
- Cosine similarity vector classification
- Domain and title heuristics for smarter AI behavior

## 📁 Folder Structure

