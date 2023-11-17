### Hexlet tests and linter status:
[![Actions Status](https://github.com/anorone/frontend-testing-react-project-67/workflows/hexlet-check/badge.svg)](https://github.com/anorone/frontend-testing-react-project-67/actions)

## Description
The utility gets page url and output directory as parameters, downloads the page and saves it locally for the offline use.

## Installation & Usage
Clone the repo.
Run commands:
```shell
$ cd <project folder>
$ make install
```
From now on there will be `page-loader` command available in the global scope.
```shell
# Run to see the help page
$ page-loader --help
```
To prepare the package for working in the _develpment mode_ do the following:
```shell
$ make prepare
```

## Tests
This command runs the tests:
```shell
$ make test
```

## Uninstallation
The package installation using instructions above links the package to the global scope of your computer just like `npm link` command does. To remove it you can run the following:
```shell
$ make uninstall
```
