import {
	Element,
	EndTagNode,
} from '../../parser/';
import {
	CustomRule,
	VerifyReturn,
} from '../../rule';
import messages from '../messages';

export type Value = 'lower' | 'upper';

export default CustomRule.create<Value, null>({
	name: 'case-sensitive-tag-name',
	defaultLevel: 'warning',
	defaultValue: 'lower',
	defaultOptions: null,
	async verify (document, locale) {
		const reports: VerifyReturn[] = [];
		await document.walk(async (node) => {
			if (
				(node instanceof Element && node.namespaceURI === 'http://www.w3.org/1999/xhtml')
				||
				node instanceof EndTagNode
			) {
				if (!node.rule) {
					return;
				}
				const ms = node.rule.level === 'error' ? 'must' : 'should';
				const deny = node.rule.value === 'lower' ? /[A-Z]/ : /[a-z]/;
				const message = await messages(locale, `{0} of {1} ${ms} be {2}`, 'Tag name', 'HTML', `${node.rule.value}case`);
				if (deny.test(node.nodeName)) {
					reports.push({
						level: node.rule.level,
						message,
						line: node.line,
						col:
							node instanceof Element
							?
							node.col + 1 // remove "<" char.
							:
							node.col + 2, // remove "</" char.
						raw: node.nodeName,
					});
				}
			}
		});
		return reports;
	},
});
