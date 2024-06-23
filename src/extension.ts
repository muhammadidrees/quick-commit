import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "quick-commit" is now active!');

	const disposable = vscode.commands.registerCommand('quick-commit.quickCommit', async () => {
		const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
		const git = gitExtension.getAPI(1);

		// get current repository
		const repository = git.repositories[0];

		// if there is no repository, show error message
		if (!repository) {
			vscode.window.showErrorMessage('No repository found');
			return;
		}

		const config = vscode.workspace.getConfiguration('quickCommit');
		const commitMessage = config.get('defaultMessage', 'Quick commit');

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Committing changes',
			cancellable: false
		}, async () => {
			try {
				await repository.add([]);
				await repository.commit(commitMessage);
				vscode.window.showInformationMessage('Changes committed successfully!');
			} catch (error: Error | any) {
				console.error(error);
				vscode.window.showErrorMessage('Error committing changes: ' + error.message);
			}
		});
	});

	context.subscriptions.push(disposable);

}


export function deactivate() { }
