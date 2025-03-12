# Contribution guide
## Introduction
Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).
You will also be required to agree to a [CLA](./CLA.md) before contributing to the repository.
## Setup
Read on how to [build the project](../../build/index.js)

## Code Style Guide
The coding style is enforced using eslint.
Use the following command to ensure that your changes follows the required style by running the following command before committing:
 ```bash
 npm run lint:fix
 ```

## Contributing
### Issues
Ensure that there is no related/similar issue before creating an issue.

If you are asking a question, move to discussions.

Use the issue templates provided.
If you are asking a question,move to discussions

### Commits
Ensure you follow the [commit guide](./commit.md)

### Pull requests
Ensure you have discussed with the maintainers if you are unsure about a contribution or raise an issue about it.

If your PR is doing little more than changing the source code into a way you prefer then the maintainers will automatically close it.These changes include formatting the codebase in a way you like, uneccessarily changing variable names e.t.c

Each PR should focus on one thing e.g fixing a bug, implementing a singular feature, deprecating a feature e.t.c(if you find yourself adding the word 'and' to the PR,then probably you should separate them out into different PRs)

## Vocabulary

PR - Pull request

CLA - Contributor Licence Agreement

Contributor - A person who has reported an issue or made a pull request which is merged into the project.

Maintainer - A contributor with write access to the project.
