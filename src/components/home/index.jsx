import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faServer,
  faUser,
  faDatabase
} from "@fortawesome/free-solid-svg-icons";
import { ArcherContainer, ArcherElement } from "react-archer";
import {
  Container,
  FlexContainer,
  OptionsContainer,
  TableWrapper
} from "./styles";
import { Select, Button } from "antd";
import { REQUEST_SIZES } from "../../constants";

const { Option } = Select;

const getRequestColor = requestCode => {
  switch (requestCode) {
    case 1:
      return "#000075";
    case 2:
      return "#42d4f4";
    case 3:
      return "#f58231";
    case 4:
      return "#bfef45";
    case 5:
      return "#911eb4";
    case 6:
      return "#fabed4";

    default:
      return "transparent";
  }
};

const getCacheColor = (size, available) => {
  const fillPercentage = (size - available) / size;
  if (fillPercentage > 0.75 && fillPercentage <= 1) {
    return "red";
  }
  if (fillPercentage > 0.5 && fillPercentage <= 0.75) {
    return "yellow";
  }
  if (fillPercentage > 0.25 && fillPercentage <= 0.5) {
    return "blue";
  }
  return "#e8e8e8";
};

const prettifyCacheName = incomingCacheName => {
  return (
    incomingCacheName.charAt(0).toUpperCase() + incomingCacheName.slice(1)
  ).replace("_", " ");
};

const getServerTarget = (requestMap, requestType, databaseCalled) => {
  if (databaseCalled) {
    return "database";
  }
  if (requestMap[requestType]) {
    return requestMap[requestType];
  }

  return "server";
};

const getCacheTarget = (
  actualId,
  activeCache,
  databaseCalled,
  allottedCache
) => {
  if (databaseCalled && allottedCache === actualId) {
    return "server";
  }
  if (activeCache === actualId) {
    return "server";
  }
  return actualId;
};

class Home extends Component {
  state = {
    requestingServer: false,
    databaseCalled: false,
    requestType: null,
    allottedCache: "",
    activeCache: "",
    requestMap: {},
    requestCounts: {},
    cacheDetails: {
      cache_1: {
        size: 100,
        available: 100
      },
      cache_2: {
        size: 100,
        available: 100
      },
      cache_3: {
        size: 100,
        available: 100
      },
      cache_4: {
        size: 100,
        available: 100
      }
    }
  };

  findSuitableCache = requestSize => {
    const { cacheDetails } = this.state;
    console.log(Object.entries(cacheDetails));

    const cacheServer = Object.entries(cacheDetails).find(
      ([cache, { available }]) => available >= requestSize
    );

    if (cacheServer) {
      // return cache identifier
      return cacheServer[0];
    } else {
      // start with cache eviction
      return "cache_1";
      // this.emptyCache()
    }
  };

  // update or set request count if not available
  updateRequestCount = requestType => {
    this.setState(prevState => ({
      requestCounts: {
        ...prevState.requestCounts,
        [requestType]: (prevState.requestCounts[requestType] || 0) + 1
      }
    }));
  };

  makeServerRequest = () => {
    const { requestType, requestMap } = this.state;
    const requestSize = REQUEST_SIZES.find(({ value }) => value === requestType)
      .size;

    this.setState({ requestingServer: true }, () => {
      if (requestMap[requestType]) {
        this.setState(
          {
            activeCache: requestMap[requestType],
            databaseCalled: false
          },
          () => {
            this.updateRequestCount(requestType);
          }
        );
      } else {
        // finds the request type and returns size from it
        const requestedCache = this.findSuitableCache(requestSize);

        // database is called and alloted cache is set and count is updated
        this.setState(
          {
            activeCache: "",
            databaseCalled: true,
            allottedCache: requestedCache
          },
          () => {
            this.updateRequestCount(requestType);
          }
        );

        // update request map with cache details
        this.updateRequestMap(requestType, requestedCache);

        // updating cache details with new values
        this.updateCacheDetails(requestedCache, requestSize);
      }
    });
  };

  updateRequestMap = (requestType, requestedCache) => {
    this.setState(prevState => ({
      requestMap: { ...prevState.requestMap, [requestType]: requestedCache }
    }));
  };

  updateCacheDetails = (requestedCache, requestSize) => {
    const { cacheDetails } = this.state;
    const cacheDetailsCopy = { ...cacheDetails };
    // updates cache details with new values
    cacheDetailsCopy[requestedCache].available =
      cacheDetailsCopy[requestedCache].available - requestSize;

    this.setState({
      cacheDetails: cacheDetailsCopy
    });
  };

  requestSelection = value => {
    this.setState({ requestType: value });
  };

  render() {
    const {
      requestingServer,
      requestType,
      requestMap,
      requestCounts,
      cacheDetails,
      activeCache,
      databaseCalled,
      allottedCache
    } = this.state;

    return (
      <>
        <OptionsContainer>
          <Select
            placeholder="Select a request"
            onChange={this.requestSelection}
            value={requestType}
          >
            {REQUEST_SIZES.map(({ name, value }, index) => (
              <Option value={value} key={`request-${index + 1}`}>
                <span style={{ color: getRequestColor(index + 1) }}>
                  {name}
                </span>
              </Option>
            ))}
          </Select>

          <Button
            type="primary"
            className="m-l-8"
            onClick={this.makeServerRequest}
            disabled={!requestType}
          >
            Request
          </Button>          

          <TableWrapper>
            <div className="table-container">
              <table>
                <tbody>
                  <tr>
                    <th>Request name</th>
                    <th>Available in</th>
                  </tr>
                  {Object.entries(requestMap).map(
                    ([requestType, cacheIndetifier]) => (
                      <tr>
                        <td>Request {requestType}</td>
                        <td>{prettifyCacheName(cacheIndetifier)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <br />
            </div>

            <div className="table-container">
              <table>
                <tbody>
                  <tr>
                    <th>Request name</th>
                    <th>Count</th>
                  </tr>
                  {Object.entries(requestCounts).map(([requestType, count]) => (
                    <tr>
                      <td>Request {requestType}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableWrapper>
        </OptionsContainer>

        <ArcherContainer
          strokeColor={getRequestColor(requestType)}
          style={{ top: 100 }}
        >
          <Container>
            <div>
              <FlexContainer>
                <div>
                  <ArcherElement
                    id="user"
                    relations={[
                      {
                        targetId: requestingServer ? "server" : "user",
                        targetAnchor: "middle",
                        sourceAnchor: "bottom"
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faUser}
                        size="4x"
                        className="user"
                      />
                    </div>
                  </ArcherElement>
                  <div className="m-t-8">
                    <p>
                      <b>User</b>
                    </p>
                  </div>
                </div>

                <div>
                  <ArcherElement
                    id="server"
                    relations={[
                      {
                        targetId: getServerTarget(
                          requestMap,
                          requestType,
                          databaseCalled
                        ),
                        targetAnchor: "middle",
                        sourceAnchor: "bottom"
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faServer}
                        size="4x"
                        className="server"
                      />
                    </div>
                  </ArcherElement>
                  <p>
                    <b>Server</b>
                  </p>
                </div>

                <div>
                  <ArcherElement
                    id="cache_1"
                    relations={[
                      {
                        targetId: getCacheTarget(
                          "cache_1",
                          activeCache,
                          databaseCalled,
                          allottedCache
                        ),
                        targetAnchor: "middle",
                        sourceAnchor: "bottom",
                        style: {
                          strokeDasharray: "5,5",
                          strokeColor:
                            (databaseCalled && allottedCache === "cache_1") ||
                            activeCache === "cache_1"
                              ? "#bfef45"
                              : "transparent"
                        }
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faDatabase}
                        size="3x"
                        className="cache m-b-8"
                        style={{
                          color: getCacheColor(
                            cacheDetails.cache_1.size,
                            cacheDetails.cache_1.available
                          )
                        }}
                      />
                    </div>
                  </ArcherElement>

                  <ArcherElement
                    id="cache_2"
                    relations={[
                      {
                        targetId: getCacheTarget(
                          "cache_2",
                          activeCache,
                          databaseCalled,
                          allottedCache
                        ),
                        targetAnchor: "middle",
                        sourceAnchor: "bottom",
                        style: {
                          strokeDasharray: "5,5",
                          strokeColor:
                            (databaseCalled && allottedCache === "cache_2") ||
                            activeCache === "cache_2"
                              ? "#bfef45"
                              : "transparent"
                        }
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faDatabase}
                        size="3x"
                        className="cache m-b-8"
                        style={{
                          color: getCacheColor(
                            cacheDetails.cache_2.size,
                            cacheDetails.cache_2.available
                          )
                        }}
                      />
                    </div>
                  </ArcherElement>

                  <ArcherElement
                    id="cache_3"
                    relations={[
                      {
                        targetId: getCacheTarget(
                          "cache_3",
                          activeCache,
                          databaseCalled,
                          allottedCache
                        ),
                        targetAnchor: "middle",
                        sourceAnchor: "bottom",
                        style: {
                          strokeDasharray: "5,5",
                          strokeColor:
                            (databaseCalled && allottedCache === "cache_3") ||
                            activeCache === "cache_3"
                              ? "#bfef45"
                              : "transparent"
                        }
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faDatabase}
                        size="3x"
                        className="cache m-b-8"
                        style={{
                          color: getCacheColor(
                            cacheDetails.cache_3.size,
                            cacheDetails.cache_3.available
                          )
                        }}
                      />
                    </div>
                  </ArcherElement>

                  <ArcherElement
                    id="cache_4"
                    relations={[
                      {
                        targetId: getCacheTarget(
                          "cache_4",
                          activeCache,
                          databaseCalled,
                          allottedCache
                        ),
                        targetAnchor: "middle",
                        sourceAnchor: "bottom",
                        style: {
                          strokeDasharray: "5,5",
                          strokeColor:
                            (databaseCalled && allottedCache === "cache_4") ||
                            activeCache === "cache_4"
                              ? "#bfef45"
                              : "transparent"
                        }
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faDatabase}
                        size="3x"
                        className="cache m-b-8"
                        style={{
                          color: getCacheColor(
                            cacheDetails.cache_4.size,
                            cacheDetails.cache_4.available
                          )
                        }}
                      />
                    </div>
                  </ArcherElement>

                  <p>
                    <b>Caching database</b>
                  </p>
                </div>

                <div>
                  <ArcherElement
                    id="database"
                    relations={[
                      {
                        targetId: allottedCache || "database",
                        targetAnchor: "middle",
                        sourceAnchor: "bottom",
                        style: {
                          strokeDasharray: "5,5",
                          strokeColor:
                            databaseCalled && allottedCache
                              ? "#42d4f4"
                              : "transparent"
                        }
                      }
                    ]}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faDatabase}
                        size="4x"
                        className="database"
                      />
                    </div>
                  </ArcherElement>
                  <div>
                    <p>
                      <b>Database</b>
                    </p>
                  </div>
                </div>
              </FlexContainer>
            </div>
          </Container>
        </ArcherContainer>
      </>
    );
  }
}

export default Home;
