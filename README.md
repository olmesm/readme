# README

Readme generator. Features customizable templates that are fetched on load.

## Custom Templates

Download and serve the files from [custom-templates.zip](https://readme.ohmybuck.com/custom-templates.zip)

```bash
# using curl
curl -O https://readme.ohmybuck.com/custom-templates.zip
# or using wget
wget https://readme.ohmybuck.com/custom-templates.zip
```

## Uses

- [asdf](https://asdf-vm.com)

## Developing

```bash
asdf plugin add nodejs
asdf install

# Install dependencies
npm install

# Start dev server
npm run dev

# Testing
npm run test
```

## Deployment

Deploys to github pages when merged to main branch. See the [workflow file](/.github/workflows/gh-pages.yml).

## TODO

- [DND Kit to drag and drop](https://dndkit.com)
- e2e testing
- templates
  - features
  - Tech Stack
  - Usage/Examples
  - Used By
  - Feedback
  - installation
  - Support
  - testing
  - workflow
  - related
  - Resources => Appendix
  - Demo
  - Screenshots
  - Documentation
  - FAQ
  - Troubleshooting
  - standards/styleguide
