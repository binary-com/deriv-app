import ServerTime from '_common/base/server_time';
import { toMoment } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';

const isBeforeDate = (compare_moment: moment.Moment, start_moment: moment.Moment, should_only_check_hour: boolean) => {
    const now_moment = toMoment(start_moment);
    if (should_only_check_hour) {
        now_moment.minute(0).second(0);
    }
    return compare_moment.isBefore(now_moment) && now_moment.unix() !== compare_moment.unix();
};

export const isSessionAvailable = (
    sessions: ReturnType<typeof useTraderStore>['sessions'] = [],
    compare_moment: moment.Moment = toMoment(ServerTime.get()),
    start_moment: moment.Moment = toMoment(ServerTime.get()),
    should_only_check_hour = false
) =>
    !isBeforeDate(compare_moment, ServerTime.get(), should_only_check_hour) &&
    !isBeforeDate(compare_moment, start_moment, should_only_check_hour) &&
    (!sessions.length ||
        !!sessions.find(session =>
            compare_moment.isBetween(session.open, session.close, should_only_check_hour ? 'hour' : null, '[]')
        ));
