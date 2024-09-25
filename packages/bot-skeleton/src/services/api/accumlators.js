// import { api_base } from './api-base';

// export default class Accumulators {
//     constructor() {
//         this.subscription_id = null;
//         this.accumulator_stats = [];
//         this.api_called = false;
//         this.ticks_stayed_in = [];
//     }

//     async requestAccumulators(request, dashboard) {
//         if (request.contract_type !== 'ACCU' && !this.api_called) return;
//         this.api_called = true;
//         const accumulator_response = await api_base?.api?.send(request);
//         this.pushAccumulatorStats(accumulator_response.proposal.contract_details.ticks_stayed_in, dashboard);
//         this.subscription_id = accumulator_response?.subscription?.id;
//         this.observerAccumlatorsContract(dashboard, request);
//         return accumulator_response;
//     }

//     observerAccumlatorsContract(dashboard, request) {
//         if (!api_base?.api) return;
//         const subscription = api_base?.api?.onMessage().subscribe(response => {
//             if (response.data.msg_type === 'proposal') {
//                 const ticks_stayed_in = response?.data?.proposal?.contract_details?.ticks_stayed_in;
//                 if (Array.isArray(ticks_stayed_in)) {
//                     if (ticks_stayed_in.length > 1) {
//                         this.pushAccumulatorStats(ticks_stayed_in, dashboard);
//                     } else {
//                         this.requestAccumulators(request, dashboard);
//                         dashboard.setAccumulatedStats(this.accumulator_stats);
//                         this.accumulator_stats[0] = ticks_stayed_in[0];
//                     }
//                 }
//                 this.api_called = true;
//             }
//         });
//         api_base?.pushSubscription(subscription);
//     }

//     pushAccumulatorStats(accumulator, dashboard) {
//         this.accumulator_stats = [...this.accumulator_stats, ...accumulator];
//         this.getAccumulatorStats(dashboard);
//     }

//     getAccumulatorStats(dashboard) {
//         return dashboard.setAccumulatedStats(this.accumulator_stats);
//     }
// }

//TODO: commented code for stats bar
