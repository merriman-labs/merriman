const text = `
usage: node-media-server <command>

These are the available commands:

  config        Use interactive configuration wizard to configure server
  initdir       Initialize a directory, i.e. add some media from a directory to the server DB
  editconfig    Edit the server configuration
  run           Start the server
`;

export default () => {
  console.log(text);
};
