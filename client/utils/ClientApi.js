import superagent from "superagent";

class ClientApi {
  async request(api, method = "get", params = {}, query = {}) {
    const res = await superagent[method](
      `${window.location.origin}/api/v1/${api}`
    )
      .set("Accept", "application/json")
      .query(query)
      .send(params);

    return res.body;
  }
}

export default new ClientApi();
