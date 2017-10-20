/**
 * Created by paulbarrass on 19/10/2017.
 */
import React, {Component, PropTypes} from 'react';
import {connectMenu, ContextMenu, MenuItem, SubMenu} from 'react-contextmenu';
import {spotifyAddTrackToPlaylist} from '../../redux/modules/spotify';
import {connect} from 'react-redux';
import take from 'lodash/take';
import ellipsize from 'ellipsize';

import '!!style!css!./contextMenu.css';

class TrackContextMenu extends Component {
	static propTypes = {
		myPlaylists: PropTypes.array,
		handleClickSaveToPlaylist: PropTypes.func,
		trigger: PropTypes.object,
		id: PropTypes.any
	};

	handleClick(e, data) {
		console.log(data);
	}

	render() {
		const {myPlaylists, handleClickSaveToPlaylist, id, trigger} = this.props;
		if (!trigger) {
			return (
				<ContextMenu id={id}>
					<MenuItem disabled={true}/>
				</ContextMenu>
			);
		}

		const {track} = trigger;
		let album = track.album;
		if (!album && track.json) {
			album = track.json.album;
		}
		const title = `${track.name} by ${track.artists && track.artists.map(artist => artist.name).join(', ')}`;

		return (
			<ContextMenu id={id}>
				<MenuItem disabled={true}>
					<span title={title}>{trigger && ellipsize(title, 40)}</span>
				</MenuItem>
				<MenuItem divider/>
				{album && (
					<SubMenu title='Album'>
						<MenuItem disabled={true}>
							{trigger && ellipsize(`${album.name}`, 40)}
						</MenuItem>
						<MenuItem divider/>
						<MenuItem data={{album}}
								  onClick={() => {
									  console.log(track);
									  alert('todo...');
								  }}>
							Browse in Soundbounce
						</MenuItem>

						<MenuItem data={{album}}
								  onClick={() => {
									  document.location = `spotify:album:${album.id}`;
								  }}>
							View in Spotify
						</MenuItem>
						<MenuItem divider/>
						<MenuItem data={{album}}
								  onClick={() => {
									  alert('todo...');
								  }}>
							Copy Album Link
						</MenuItem>
						<MenuItem data={{album}}
								  onClick={() => {
									  alert('todo...');
								  }}>
							Copy Spotify URI
						</MenuItem>
					</SubMenu>
				)}
				<MenuItem divider/>
				<MenuItem onClick={() => {
					alert('todo...');
				}}>
					Vote to skip
				</MenuItem>

				{myPlaylists && (
					<SubMenu title='Add to playlist'>
						{
							take(myPlaylists, 16).map(playlist => (
								<MenuItem data={{trigger, playlist}}
										  key={playlist.id}
										  onClick={handleClickSaveToPlaylist}>
									{ellipsize(playlist.name, 50)}
								</MenuItem>
							))
						}
					</SubMenu>
				)}

				<MenuItem data={{track}}
						  onClick={() => {
							  document.location = `spotify:track:${track.id}`;
						  }}>
					View in Spotify
				</MenuItem>
				<MenuItem divider/>
				<MenuItem data={{album}}
						  onClick={() => {
							  alert('todo...');
						  }}>
					Copy Song Link
				</MenuItem>
				<MenuItem data={{album}}
						  onClick={() => {
							  alert('todo...');
						  }}>
					Copy Spotify URI
				</MenuItem>


			</ContextMenu>
		);
	}
}

const mapStateToProps = state => ({
	myPlaylists: state.spotify.myPlaylists
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleClickSaveToPlaylist: (e, {playlist, trigger}) => {
		dispatch(spotifyAddTrackToPlaylist({
			playlistId: playlist.id,
			trackId: trigger.trackId
		}));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(connectMenu('track')(TrackContextMenu));

