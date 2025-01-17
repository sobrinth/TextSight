![TextSight gif](https://github.com/devluixos/TextSight/blob/master/showcase_gif.gif)

## Get in contact
**[Discord](https://discord.com/invite/bsECGrvScp)**

**[Blog](https://publish.obsidian.md/luix/)**

## TextSight
TextSight is an Obsidian plugin that leverages OpenAI's advanced language models to analyze your notes and uncover connections based on topics, keywords, and named entities. It utilizes Dexie.js as a wrapper for IndexedDB, facilitating efficient data management and retrieval within the plugin. TextSight helps you visualize these connections in a 3D environment, providing a holistic view of your research or notes. This tool is designed to assist you in discovering hidden insights, navigating through your ideas, and gaining a deeper understanding of your data.

## Usage
The current prototype only allows it to analyse 1 document at a time.
For that, you have to open the sidebar either through a click on the icon on the left or a click on the status bar.
1. Open the document that you want to analyse.
2. In the `Analysis` tab of the sidebar, make sure that the correct document is selected in the dropdown. Then press `Analyse Text`
3. Repeat that for a few texts (you can see the results posted in the developer console, open with `ctrl + shift + i`.
4. Change to the TextSight tab and click `Analyse Connections`. Once that is done you have to reload the visualisation (top right button)
5. If you run into problems I suggest you press `ctrl + p` and search for `Reload app without saving`

## Installation
#### For General Users
All of this happens in the command line. If you have not installed it go [here](https://github.com/git-guides/install-git). Open the command line and navigate to your Vault.

**Clone the Plugin**
Navigate to your Obsidian vault's plugins folder. This is typically located in your vault's root directory under `.obsidian/plugins/.` Clone the TextSight repository into this directory using the following command:

```bash
git clone https://github.com/devluixos/TextSight.git
```

**Install Dependencies:**
Navigate into the TextSight directory in `.obsidian/plugins/.` and open the console here. You will have to have [nodejs](https://nodejs.org/en/download/package-manager) installed.
Run the following command to install the necessary dependencies:

```bash
npm install
```

**Run the build for the plugin**
The last step is to create a build of the code for it to work inside obsidian:

```bash
npm run build
```

**Enable in Obsidian:**
Open Obsidian, go to `Settings` -> `Community Plugins`, disable `Safe Mode`, and enable `TextSight` from the list.

**API Key Setup:**
Open the plugin settings from the sidebar and enter your OpenAI API key.
![ApiKey](https://github.com/devluixos/TextSight/blob/master/apikeyadding.png)

## Quickstart for Developers
If you want to contribute to the development of TextSight or customize it further, follow these steps:

**Fork and Clone the Repository:**
Fork the repository on GitHub and clone your fork to your local machine:
```bash
git clone https://github.com/yourusername/TextSight.git
```

**Install Dependencies:**
Navigate into the TextSight directory and install the dependencies:
```bash
npm install
```

**API Key Setup:**
Run the setup script and enter your OpenAI API key when prompted:
```bash
npm run setup
```

**Start the Development Server:**
Start the development server to watch for changes and automatically reload:
```bash
npm run dev
```

**Make Your Changes:**
Implement your features or bug fixes. Ensure that your code follows common sense.

Commit and Push:
Commit your changes and push them to your forked repository:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
**Create a Pull Request:**
Create a pull request to the main repository. Provide a detailed description of your changes and the problem they solve.

## Contributing

We welcome contributions from the community! Whether you're a developer, designer, or tester, there's a place for you in the TextSight project. Check out our [Discord](https://discord.com/invite/bsECGrvScp))

If you'd like to write some code but don't know where to start, we've written some [ToDos](https://publish.obsidian.md/luix/Master+Thesis/TextSight_Publish/Development/1+Introduction.).

## Feedback and Testing

Testers are always welcome. Give TextSight a try, analyze a few documents, and provide feedback (preferably on [Discord](https://discord.com/invite/bsECGrvScp)). Your insights are invaluable in making TextSight better.

TextSight currently uses OpenAI's GPT-4o model, so you need an API key. If you cannot get one, we have a few keys with a $5 budget each for you. With $5 you'll be able to analyze a significant number of documents.

## Acknowledgments
#### Islands
Island by J-Toastie [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/C03O8OQq6O)

Medium Island by J-Toastie [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/YFs6J9xPdZ)

Large Island by J-Toastie [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/jLjH1jMIpH)

#### Trees
Tree by Marc Solà [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/6Yjt8nIwLsD)

Big Tree by 3Donimus [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/dNWh762PN-6)

Pine Tree by Danni Bittman [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/2Qo-fmVKuSG)

Tree Fall by Kenney (https://poly.pizza/m/XMvD3AilGv)

Willow tree by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/2acu5nrdDYl)

#### Rocks
Rock Large by Quaternius (https://poly.pizza/m/54jZKTAt5p)

Rock by Quaternius (https://poly.pizza/m/HtpdTh3Ld6)

Rock by Quaternius (https://poly.pizza/m/4MUaQTcDdc)

#### House 
Hut by Jarlan Perez [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/3OlnbRfwPLc)

#### Bench
Bench by Quaternius (https://poly.pizza/m/jLxjFxFRpw)
