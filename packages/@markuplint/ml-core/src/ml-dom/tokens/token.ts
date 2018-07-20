import { MLToken } from '@markuplint/ml-ast/src';
import Document from '../document';

export default class Token<A extends MLToken> {
	public readonly startLine: number;
	public readonly endLine: number;
	public readonly startCol: number;
	public readonly endCol: number;
	public readonly startOffset: number;
	public readonly endOffset: number;

	protected readonly _astToken: A;

	private readonly _originRaw: string;
	private _fixed: string;

	constructor(astToken: A) {
		this._astToken = astToken;
		this._originRaw = astToken.raw;
		this._fixed = astToken.raw;
		this.startLine = astToken.startLine;
		this.endLine = astToken.endLine;
		this.startCol = astToken.startCol;
		this.endCol = astToken.endCol;
		this.startOffset = astToken.startOffset;
		this.endOffset = astToken.endOffset;
	}

	public get raw() {
		return this._fixed;
	}

	// public toJSON() {
	// 	return {
	// 		raw: this.raw,
	// 		startLine: this.startLine,
	// 		endLine: this.endLine,
	// 		startCol: this.startCol,
	// 		endCol: this.endCol,
	// 		startOffset: this.startOffset,
	// 		endOffset: this.endOffset,
	// 	};
	// }

	public fix(raw: string) {
		this._fixed = raw;
	}
}