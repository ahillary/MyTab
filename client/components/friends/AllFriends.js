import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {_loadFriends} from '../../store/friends/friends'
// , _deleteFriend

export class AllFriends extends React.Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this.props.loadFriends()
  }

  handleDelete = (friendToDelete) => {
    this.props.deleteFriend(friendToDelete)
  }

  noFriends = (friendList) => {
    if (friendList.length < 1) {
      return 'Add your friends to MyTab'
    }
  }

  render() {
    const friendList = this.props.friends
    return (
      <div>
        <main>
          <h2>All the friends are belong to us</h2>
        </main>
        <div id="full-friend-list">
          {this.noFriends(friendList)}
          <ul>
            {friendList.map((friendItem) => {
              return (
                <div key={`friend-${friendItem.id}`}>
                  <Link to={`/friends/${friendItem.id}`}>
                    {friendItem.firstName} {friendItem.lastName}
                  </Link>
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {friends: state.friends}
}

const mapDispatchToProps = (dispatch) => ({
  loadFriends: () => dispatch(_loadFriends()),
  deleteFriend: (friend) => dispatch(_deleteFriend(friend)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AllFriends)