NS=page-loader

prepare:
	npm ci
	npx husky install

install:
	npm ci --omit=dev
	npm link

lint:
	npx eslint .

test:
	npm run test

debug:
	DEBUG=${NS} npm run test

uninstall:
	npm unlink -g @hexlet/code

publish:
	npm publish --dry-run
