import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, sortSearchResults } from 'obsidian';
import { Graphviz } from "@hpcc-js/wasm";


interface Graphviz {
	dot(source: string): string;
}

export default class GVPlugin extends Plugin {
	graphviz: Graphviz;

	async onload() {
		await this.loadSettings();

		// possible layouts: circo | dot | fdp | sfdp | neato | osage | patchwork | twopi | nop | nop2
		this.graphviz = await Graphviz.load();

		let renderer = (source: string, el: HTMLElement, ctx: any) => {
			try {
				let svg = this.graphviz.dot(source);
				svg = svg.replace(/<svg width="([^"]+)"/, '<svg width="min($1,100%)"');
				let div = el.createEl("div", { cls: "graphviz" });
				div.innerHTML = svg;
			} catch (err) {
				let div = el.createEl("div", { text: err });
				div.style.color = "white";
				div.style.backgroundColor = "#4e3535";
				el.appendChild(div);
			}

		};
		this.registerMarkdownCodeBlockProcessor("graphviz", renderer);
	}

	onunload() {

	}

	async loadSettings() { }

	async saveSettings() { }
}
