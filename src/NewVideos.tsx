import React, { Component } from 'react';
import Video from './Video';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardImgOverlay,
  CardText,
  Form,
  Label
} from 'reactstrap';
import Chance from 'chance';
import { MediaItem, Library } from '../server/models';
import MediaListing from './MediaListing';
import { sortBy, splitEvery, reverse } from 'ramda';
import ListGroup from 'reactstrap/lib/ListGroup';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import moment from 'moment';
import ReactImageFallback from 'react-image-fallback';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';

const chance = Chance.Chance(Math.random);

type VideoLibrariesPageProps = {
  match: {
    params: {
      library: string;
      video: string;
    };
  };
};

type VideoLibrariesPageState = {
  media: Array<MediaItem>;
  video: MediaItem | null;
  count: number;
};

class NewVideosPage extends Component<
  VideoLibrariesPageProps,
  VideoLibrariesPageState
> {
  constructor(props: VideoLibrariesPageProps) {
    super(props);
    this.state = {
      media: [],
      video: null,
      count: 60
    };
  }

  componentDidMount() {
    this._fetchVideoList();
  }
  handleCountChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ count: parseInt(val.target.value) }, this._fetchVideoList)
  }
  render() {
    return (
      <Container>
        <Row>
          <Col md="3">
            <Form>
              <FormGroup>
                <Label for="count">Show</Label>
                <Input
                  id="count"
                  type="number"
                  onChange={this.handleCountChange}
                  value={this.state.count}
                  step={3}
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.video ? (
              <Video library={'blank'} video={this.state.video._id} />
            ) : (
              <div />
            )}
          </Col>
        </Row>
        {this.state.media && this.state.media.length
          ? splitEvery(3, reverse(sortBy(x => moment(x.created).unix(), this.state.media))).map(
              group => (
                <Row>
                  {group.map(item => (
                    <Col>
                      <Card onClick={() => this.setState({ video: item })}>
                        <ReactImageFallback
                          className="card-image"
                          src={`/${item.filename}.png`}
                          fallbackImage="/blank.png"
                        />
                        <CardImgOverlay className="thumbnail-link">
                          <CardText>
                            {item.name}{' '}
                            {moment(item.created).format('MM/DD/YYYY HH:mm')}
                          </CardText>
                        </CardImgOverlay>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )
            )
          : null}
      </Container>
    );
  }
  _fetchVideoList = () => {
    return fetch(`/api/media/latest/${this.state.count}`)
      .then(response => response.json())
      .then(response => this.setState({ media: response }));
  };
}

export default NewVideosPage;
