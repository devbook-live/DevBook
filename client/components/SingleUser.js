import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import { DocsListByUserId, GroupsListByUserId } from './';

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
    };
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    })
  }




  render() {
    return(
      <div>

        <div className="userPage">
          <div className="userPic">
            <CardMedia
            className="userPic"
              overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
            >
              <img
              src="https://i0.wp.com/www.thisblogrules.com/wp-content/uploads/2010/02/batman-for-facebook.jpg?resize=250%2C280" alt="" />
            </CardMedia>
          </div>
          <div className="userInfo">
            <CardTitle title="Name: " subtitle="Card subtitle" />
            <CardText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
            <CardActions>
              <FlatButton label="Action1" />
              <FlatButton label="Action2" />
            </CardActions>
          </div>
        </div>

        <div>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="Groups" value="a">
              <div>
                {/* <h2>Controllable Tab A</h2>
                <p>
                  Tabs are also controllable if you want to programmatically pass them their values.
                  This allows for more functionality in Tabs such as not
                  having any Tab selected or assigning them different values.
                </p> */}
                <GroupsListByUserId userId={"1"} />
              </div>
            </Tab>

          <Tab label="Notes" value="b">
            <div>
              <DocsListByUserId userId={"1"} />
            </div>
          </Tab>
        </Tabs>
        </div>
      </div>
    )
  }
}

export default SingleUser;
