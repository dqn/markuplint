import { MLASTAbstructNode, MLASTNode, MLASTParentNode } from '@markuplint/ml-ast';
import { RuleConfig, RuleConfigOptions, RuleConfigValue } from '@markuplint/ml-config';

import { RuleInfo } from '../../ml-rule';
import Document from '../document';
import { getNode, setNode } from '../helper/dom-traverser';
import Indentation from '../indentation';
import { AnonymousNode, NodeType } from '../types';
import Element from './element';
import OmittedElement from './omitted-element';
import Token from './token';

export default abstract class Node<
	T extends RuleConfigValue,
	O extends RuleConfigOptions,
	A extends MLASTAbstructNode
> extends Token<A> {
	public readonly type: NodeType = 'Node';
	public prevSyntaxicalNode: Node<T, O, A> | null = null;
	public indentation: Indentation<T, O> | null = null;

	protected _astToken: A;

	private _doc: Document<T, O>;

	constructor(astNode: A, document: Document<T, O>) {
		super(astNode);
		this._astToken = astNode;
		this._doc = document;

		// TODO: type
		// @ts-ignore
		setNode(astNode, this);
	}

	public get parentNode(): Element<T, O> | OmittedElement<T, O> | null {
		return this._astToken.parentNode ? getNode<MLASTParentNode, T, O>(this._astToken.parentNode) : null;
	}

	public get prevNode(): AnonymousNode<T, O> | null {
		return this._astToken.prevNode ? getNode<MLASTNode, T, O>(this._astToken.prevNode) : null;
	}

	public get nextNode(): AnonymousNode<T, O> | null {
		return this._astToken.nextNode ? getNode<MLASTNode, T, O>(this._astToken.nextNode) : null;
	}

	public toString() {
		return this.raw;
	}
	// 	public toJSON() {
	// 		return {
	// 			nodeName: this.nodeName,
	// 			raw: this.raw,
	// 			line: this.line,
	// 			col: this.col,
	// 			endLine: this.location.endLine,
	// 			endCol: this.location.endCol,
	// 			startOffset: this.location.startOffset,
	// 			endOffset: this.location.endOffset,
	// 		};
	// 	}

	public is(type: NodeType) {
		return this.type === type;
	}

	public get rule(): RuleInfo<T, O> {
		if (!this._doc.currentRule) {
			throw new Error('Invalid call.');
		}
		const name = this._doc.currentRule.name;

		// TODO:
		const ruleConfig: RuleConfig<T, O> | T | boolean = false;
		// const rule = this.rules[name];
		// if (rule == null) {
		// throw new Error('Invalid call "rule" property.');
		// }
		return this._doc.currentRule.optimizeOption(ruleConfig);
	}

	// 	public get syntaxicalParentNode(): Node<T, O> | null {
	// 		let node: Node<T, O> | GhostNode<T, O> = this;
	// 		while (node.parentNode && node.parentNode instanceof GhostNode) {
	// 			node = node.parentNode;
	// 		}
	// 		return node.parentNode;
	// 	}
}
