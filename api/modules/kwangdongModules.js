import { stats, user } from "../model/kwangdongPacket.js";

export const fetchUser = {
  setProfile: async (body) => {
    const data = await user.request.post(body);
    return user.response.post(data);
  },
  patchTerms: async (body) => {
    const data = await user.request.patch(body);
    return user.response.patch(data);
  },
};

export const fetchStats = {
  setUserPv: async (body) => {
    const data = await stats.request.post(body);
    return stats.response.post(data);
  },
};
