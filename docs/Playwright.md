# Playwright
Playwright is used for a combination of unit and automation tests.

The playwright tests are run against a local dev page, that is started by running npm run dev. The script is automatically executed when the tests are run.

## Running tests locally
To run the playwright tests locally enter the following command in the terminal - npx playwright test

To run a specific test file locally run - npx playwright test <testfile.spec.ts>

## Debugging tests locally
To debug playwright tests add --debug to the end of the above command, i.e. - npx playwright test <testfile.spec.ts> --debug

## Updating snapshots

### Gherkin
Gherkin provides behaviours to the tests, in the key words Given, When, And, and Then.

### SmartFilterPage
The SmartFilterPage provides the interactions to the page being test. The locators contained in the object are references to elements on the page. The object also contains functions when wrap behaviours in the form of UI interactions.

### Test specs
THe tests are dvivided by functionality.