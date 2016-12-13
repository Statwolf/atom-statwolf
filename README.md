# Statwolf

[![GitHub tag](https://img.shields.io/github/tag/statwolf/atom-statwolf.svg?style=flat-square)]()

All-in-one Statwolf packet.

## Deprecation warning

All the following packets are now considered outdated and deprecated:
- statwolf-installer
- statwolf-logger
- statwolf-console-plugin
- statwolf-atom-configuration
- statwolf-new-component-plugin
- statwolf-push-plugin

Please remove all of them and install `atom-statwolf` instead.

## Templates

The statwolf templates framework allows an user to create a new statwolf component by picking it from a list of available templates. Just right-click on a folder in the tree-view, select `Add new Statwolf component` and follow the wizard.

## Path autocompletion

The statwolf path autocompletion is automatically enabled for both javascript and json files. When you type a path starting for `Statwolf.` a list of possible paths pops out.

## Keybindings

```
Files
ctrl + alt + 8              : Open main file
ctrl + alt + 9              : Open test file
ctrl + alt + 0              : Open deps file
ctrl + click (on a sw-path) : Open component main file
ctrl + alt + o              : Open a Statwolf path

Console
ctrl + shift + j            : Execute current file
ctrl + alt + j              : Execute test file
ctrl + shift + y            : Execute current file getting tab-separated output
ctrl + alt + y              : Execute test file getting tab-separated output
ctrl + shift + w            : Execute current file in the worker
ctrl + alt + w              : Execute test file in the worker

From a form main file
ctrl + alt + g              : Open the current form in a browser
```
