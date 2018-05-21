import React from 'react';
import { Form, FormGroup, Label, Button } from 'reactstrap';

class LibraryEdit extends React.Component {
  constructor(props) {
    super(props);

    this._formSubmit = this._formSubmit.bind(this);
  }
  render() {
    return (
      <Form onSubmit={this._formSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <input type="text" name="name" ref="name" className="form-control" />
        </FormGroup>
        <FormGroup>
          <Label for="path">Path</Label>
          <input type="text" name="path" ref="path" className="form-control" />
        </FormGroup>
        <Button color="success" type="submit">
          Add
        </Button>
      </Form>
    );
  }

  _formSubmit(event) {
    event.preventDefault();
    const {
      name: { value: name },
      path: { value: location }
    } = this.refs;
    const lib = {
      name,
      location
    };
    this.props.saveLib(lib);
    this.refs.name.value = '';
    this.refs.path.value = '';
  }
}

export default LibraryEdit;
