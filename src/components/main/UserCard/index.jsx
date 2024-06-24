import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FollowButton } from '../../../components/main';
import { Avatar } from "../../../components/shared";
import { Fragment } from "react"
import moment from "moment"

function calculateTimeDifference(fromTime) {
    const currentTime = moment(); // Lấy thời gian hiện tại
    const duration = moment.duration(currentTime.diff(moment(fromTime)));

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (days > 0) {
        return `${days}${days > 1 ? 'd' : 'd'}`;
    } else if (hours > 0) {
        return `${hours}${hours > 1 ? 'h' : 'h'}`;
    } else {
        return `${minutes <= 0 ? 1 : minutes}${minutes > 1 ? 'm' : 'm'}`;
    }
}

const UserCard = ({ profile, is_page_home }) => {
    const myUsername = useSelector((state) => state.auth.username);

    return (
        <div className="relative flex items-center justify-between px-4 py-2">
            <Link to={`/user/${profile.username}`}>
                <div className="flex items-center">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                        <Avatar url={profile.profilePicture?.url} size="lg" className="mr-2" />
                        {
                            is_page_home === true && profile.active === true && <Fragment>
                                <div title="Active now" style={{ width: 16, height: 16, borderRadius: "50%", position: "absolute", bottom: 0, right: 5, zIndex: 2, background: "#2dc275" }}></div>
                            </Fragment>
                        }
                        {
                            is_page_home === true && profile.active === false && <Fragment>
                                <div title={"Active " + moment(profile.last_active).fromNow()} style={{ width: 20, height: 18, whiteSpace: "nowrap", borderRadius: "50%", color: "#2dc275", position: "absolute", bottom: 0, right: 5, zIndex: 2, background: "#242526", fontSize: 10, fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {calculateTimeDifference(profile.last_active)}
                                </div>
                            </Fragment>
                        }
                    </div>
                    <h6 className="mr-10 max-w-md overflow-ellipsis overflow-hidden dark:text-indigo-400">{(profile?.firstname && profile?.lastname) ? `${profile?.firstname} ${profile.lastname}` : `@${profile.username}`}</h6>
                </div>
            </Link>
            <div className="absolute px-4 bg-white dark:bg-transparent right-0 top-0 bottom-0 my-auto flex items-center">
                {profile.username === myUsername ? (
                    <h4 className="text-gray-400">Me</h4>
                ) : (
                    <FollowButton userID={profile.id} isFollowing={profile.isFollowing} />
                )}
            </div>
        </div>
    );
};

export default UserCard;
