<template>
  <div>
    <div class="dashboard-main container-width base-font-title">
      <div class="dashboard-sns-main">
        <div class="dashboard-sns-item">
          <div
            class="dashboard-sns-item-bold link pointer"
            @click="showSNSDappsForDappAll"
          >
            <div>
              Canisters
              <span v-if="snsNumber && SNSList.length === snsNumber">{{
                canistersNum
              }}</span>
              <span v-else>-</span>
            </div>
          </div>
          <div>
            <span>
              <span
                class="pointer"
                v-if="snsNumber && SNSList.length === snsNumber"
                @click="showStopped"
              >
                Stopped (<span :class="{ 'base-red': stopped > 0 }">{{
                  stopped
                }}</span
                >)
              </span>
              <span v-else>Stopped -</span>
            </span>
            <span>
              &nbsp;
              <span
                class="pointer"
                v-if="snsNumber && SNSList.length === snsNumber"
                @click="showInsufficient"
                >Insufficient Cycles (<span
                  :class="{ 'base-red': insufficient > 0 }"
                  >{{ insufficient }}</span
                >)
              </span>
              <span v-else>Insufficient Cycles -</span>
            </span>
          </div>
        </div>
        <div class="dashboard-sns-item">
          <div class="dashboard-sns-item-bold link pointer">
            <div>
              <router-link
                v-if="
                  snsNumberProposals && SNSList.length === snsNumberProposals
                "
                to="/icsns/proposals?id=hhaaz-2aaaa-aaaaq-aacla-cai"
              >
                <span> Proposals {{ proposals }} </span>
              </router-link>
              <span v-else>Proposals -</span>
            </div>
          </div>
          <div>
            <span>
              Open
              <span
                v-if="
                  snsNumberProposals && SNSList.length === snsNumberProposals
                "
                class="pointer"
              >
                (<router-link
                  to="/icsns/proposals?id=hhaaz-2aaaa-aaaaq-aacla-cai"
                  ><span :class="{ link: open > 0 }">{{
                    open
                  }}</span></router-link
                >)
              </span>
              <span v-else>-</span>
            </span>
          </div>
        </div>
      </div>
      <div class="dashboard-data mt20">
        <div class="dashboard-data-title">ICDex Data</div>
        <div class="dashboard-data-main">
          <div class="dashboard-data-item">
            <dl>
              <dt>Pairs</dt>
              <dd v-show="pairs.length">{{ pairs.length }}</dd>
            </dl>
          </div>
          <div class="dashboard-data-item">
            <dl>
              <dt>OAMMs</dt>
              <dd v-show="pools.length">{{ pools.length }}</dd>
            </dl>
          </div>
          <div class="dashboard-data-item">
            <dl>
              <dt>Total Vol</dt>
              <dd v-show="totalVol">{{ totalVol | formatNum }} USD</dd>
            </dl>
          </div>
          <div class="dashboard-data-item">
            <dl>
              <dt>Total TVL</dt>
              <dd v-show="totalTVL">{{ totalTVL | formatNum }} USD</dd>
            </dl>
          </div>
          <div class="dashboard-data-item">
            <dl>
              <dt>24h Vol</dt>
              <dd v-show="Vol24">{{ Vol24 | formatNum }} USD</dd>
            </dl>
          </div>
          <div class="dashboard-data-item">
            <dl>
              <dt>Proposals</dt>
              <dd>
                <span
                  v-if="
                    snsNumberProposals && SNSList.length === snsNumberProposals
                  "
                >
                  {{ proposals }}
                </span>
                <span v-else>-</span>
                <span
                  v-if="
                    snsNumberProposals && SNSList.length === snsNumberProposals
                  "
                  class="pointer"
                >
                  (<router-link
                    to="/icsns/proposals?id=hhaaz-2aaaa-aaaaq-aacla-cai"
                    ><span :class="{ link: open > 0 }">{{
                      open
                    }}</span></router-link
                  >)
                </span>
                <span v-else>(-)</span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="dashboard-icdex-main mt20">
        <div class="dashboard-icdex-item w100">
          <div class="dashboard-sns-item-bold link pointer">
            <div @click="showICDexCanisters">
              ICDex
              <span v-if="pairs.length && pools.length">{{
                pairs.length + pools.length
              }}</span>
            </div>
          </div>
          <div v-if="ICTC" class="ictc-main w100">
            <div class="ictc-item">
              <div class="link pointer" @click="showTradingPairs">
                Trading Pairs&nbsp;<span v-show="pairs.length">{{
                  pairs.length
                }}</span>
              </div>
              <div class="pointer" @click="showTradingPairsPaused">
                Paused (<span :class="{ 'base-red': ICTC.paused }">{{
                  ICTC.paused
                }}</span
                >)
              </div>
              <div class="pointer" @click="showTradingPairsBlocking">
                Blocking (<span :class="{ 'base-red': ICTC.TOBlocking }">{{
                  ICTC.TOBlocking
                }}</span
                >)
              </div>
            </div>
            <div class="ictc-item ictc-item-s">
              <div class="link pointer" @click="showTradingPools">
                OAMMs&nbsp;<span v-show="pools.length">{{ pools.length }}</span>
              </div>
              <div class="pointer" @click="showTradingPoolsPaused">
                Paused (<span :class="{ 'base-red': ICTC.pausedOAMM }">{{
                  ICTC.pausedOAMM
                }}</span
                >)
              </div>
              <div class="pointer" @click="showTradingPoolsBlocking">
                Blocking (<span :class="{ 'base-red': ICTC.TOBlockingOAMM }">{{
                  ICTC.TOBlockingOAMM
                }}</span
                >)
              </div>
            </div>
            <div class="ictc-item ictc-item-s">
              <div @click="showICDexCanisters" class="link pointer">ICTC</div>
              <div>
                TOs (<span>{{ ICTC.TOs | formatNum }}</span
                >)
              </div>
              <div>
                TTs (<span>{{ ICTC.TTs | formatNum }}</span
                >)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard-icdex-main mt20">
        <div class="dashboard-icdex-item w100">
          <div class="dashboard-sns-item-bold link pointer">
            <div>Events</div>
          </div>
          <div class="ictc-main w100">
            <div class="ictc-item">
              <div class="link pointer">
                ICDexRouter&nbsp;<span
                  @click="showICDexRouterEvents"
                  v-show="eventTotal"
                >
                  ({{ eventTotal }}/<span
                    v-show="seriousEvents.length"
                    :class="{ 'base-red': seriousEvents.length > 0 }"
                    @click.stop="showICDexRouterSeriousEvents"
                    >{{ seriousEvents.length }}</span
                  >)
                </span>
              </div>
            </div>
            <div class="ictc-item ictc-item-s">
              <div class="link pointer">
                icETHMinter&nbsp;<span
                  @click="showICETHEvents"
                  v-show="eventIcETHTotal"
                >
                  ({{ eventIcETHTotal }}/<span
                    v-show="icETHSeriousEvents.length"
                    :class="{ 'base-red': icETHSeriousEvents.length > 0 }"
                    @click.stop="showICETHSeriousEvents"
                    >{{ icETHSeriousEvents.length }}</span
                  >)
                </span>
              </div>
            </div>
            <div class="ictc-item ictc-item-s">
              <div class="link pointer">
                icBTCMinter&nbsp;<span
                  @click="showICBTCEvents"
                  v-show="eventIcBTCTotal"
                >
                  ({{ eventIcBTCTotal }}/<span
                    v-show="icBTCSeriousEvents.length"
                    :class="{ 'base-red': icBTCSeriousEvents.length > 0 }"
                    @click.stop="showICBTCSeriousEvents"
                    >{{ icBTCSeriousEvents.length }}</span
                  >)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-modal
        v-model="SNSCanistersVisible"
        width="860px"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
      >
        <div class="canisters-modal mt20">
          <!--<a-dropdown
						overlayClassName="canisters-modal-dropdown"
						placement="bottomLeft"
						:trigger="['click']"
					>
						<div class="user-menu pointer">
							{{ currentSNS }} &nbsp;<a-icon type="caret-down" />
						</div>
						<a-menu
							class="user-setting base-bg-box user-setting-account"
							slot="overlay"
							v-if="SNSMetadataList.length"
						>
							<a-menu-item
								@click="changeSNS(value)"
								class="user-setting-item"
								v-for="(value, index) in SNSMetadataList"
								:key="index"
								:class="{ active: currentSNS === value.name[0] }"
							>
								{{ value.name[0] }}
							</a-menu-item>
						</a-menu>
					</a-dropdown>-->
          <table>
            <thead>
              <tr>
                <th>Canister-id</th>
                <th>Type</th>
                <th>Cycles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in SNSDappsForDapp[currentRoot]"
                :key="index"
              >
                <td>
                  <span v-if="item.canister_id[0]">
                    {{ item.canister_id[0].toString() }}
                  </span>
                </td>
                <td>
                  {{ item.type }}
                </td>
                <td>
                  <span
                    v-if="item.status[0]"
                    :class="{
                      'base-red': Number(item.status[0].cycles) < 5 * 10 ** 12
                    }"
                  >
                    {{ item.status[0].cycles | bigintToFloat(4, 12) }}
                  </span>
                </td>
                <td>
                  <span
                    v-if="item.status[0]"
                    :class="{
                      'base-red':
                        Object.keys(item.status[0].status)[0] !== 'running'
                    }"
                  >
                    {{ Object.keys(item.status[0].status)[0] }}
                  </span>
                </td>
              </tr>
              <!--<tr
							v-for="(item, index) in SNSDapps.slice(
								(page - 1) * 10,
								page * 10
							)"
							:key="index"
						>
							<td>
								<span
									v-if="
										SNSMetadata[item.root] &&
										SNSMetadata[item.root].name &&
										SNSMetadata[item.root].name[0]
									"
								>
									{{ SNSMetadata[item.root].name[0] }}
								</span>
							</td>
							<td>
								<span v-if="item.canister_id[0]">
									{{ item.canister_id[0].toString() }}
								</span>
							</td>
							<td>
								{{ item.type }}
							</td>
							<td>
								<span
									v-if="item.status[0]"
									:class="{
										'base-red': Number(item.status[0].cycles) < 5 * 10 ** 12
									}"
								>
									{{ item.status[0].cycles | bigintToFloat(4, 12) }}
								</span>
							</td>
							<td>
								<span
									v-if="item.status[0]"
									:class="{
										'base-red':
											Object.keys(item.status[0].status)[0] !== 'running'
									}"
								>
									{{ Object.keys(item.status[0].status)[0] }}
								</span>
							</td>
						</tr>-->
            </tbody>
          </table>
          <!--<div class="nft-main-pagination">
						<a-pagination
							v-if="SNSDapps.length > 10"
							class="pagination"
							:defaultPageSize="10"
							:current="page"
							:total="SNSDapps.length"
							@change="pageChange"
						/>
					</div>-->
        </div>
      </a-modal>
      <a-modal
        v-model="ICDexCanistersVisible"
        width="1000px"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
      >
        <div class="canisters-modal mt20">
          <table>
            <thead>
              <tr>
                <th>Canister-id</th>
                <th>Name</th>
                <th>Version</th>
                <th>Status</th>
                <th>Type</th>
                <th>TOs</th>
                <th>TTs</th>
                <th>TO Blocking</th>
                <th>TT Errors</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in currentICDexCanisters.slice(
                  (pageICDexCanisters - 1) * 30,
                  pageICDexCanisters * 30
                )"
                :key="index"
              >
                <td>
                  <a
                    :href="`https://ic.house/canister/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span v-if="item[0].pairId">
                      {{ item[0].pairId }}
                    </span>
                    <span v-else>{{ item[0].poolId }}</span>
                  </a>
                </td>
                <td>
                  <router-link
                    v-if="item[0].pairId"
                    :to="`/ICDex/${item[0].pairInfo.token0[1]}/${item[0].pairInfo.token1[1]}`"
                  >
                    {{ item[0].pairInfo.name }}
                  </router-link>
                  <router-link
                    v-else
                    :to="`/ICDex/pools/pool/${item[0].poolId}`"
                  >
                    {{ item[0].poolInfo.name }}
                  </router-link>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span v-if="item[0].pairId">
                      {{ item[0].pairInfo.version }}
                    </span>
                    <span v-else>{{ item[0].poolInfo.version }}</span>
                  </a>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span v-if="item[0].pairId">
                      <span class="base-red" v-if="item[0].pairInfo.paused">
                        Paused
                      </span>
                      <span v-else>Running</span>
                    </span>
                    <span v-else>
                      <span class="base-red" v-if="item[0].poolInfo.paused">
                        Paused
                      </span>
                      <span v-else>Running</span>
                    </span>
                  </a>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span v-if="item[0].pairId"> Pair </span>
                    <span v-else>Maker</span>
                  </a>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span>
                      {{ item[1].toString(10) }}
                    </span>
                  </a>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span>
                      {{ item[2].total.toString(10) }}
                    </span>
                  </a>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span :class="{ 'base-red': getBlocking(item[4]) }">
                      {{ getBlocking(item[4]) }}
                    </span>
                  </a>
                </td>
                <td>
                  <a
                    :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/${
                      item[0].pairId ? item[0].pairId : item[0].poolId
                    }`"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <span :class="{ 'base-red': item[3].total }">
                      {{ item[3].total.toString(10) }}
                    </span>
                  </a>
                </td>
              </tr>
              <tr v-show="!currentICDexCanisters.length">
                <td class="text-center" colspan="9">No Data</td>
              </tr>
            </tbody>
          </table>
          <div class="nft-main-pagination">
            <a-pagination
              v-if="currentICDexCanisters.length > 30"
              class="pagination"
              :defaultPageSize="30"
              :current="pageICDexCanisters"
              :total="currentICDexCanisters.length"
              @change="pageICDexCanistersChange"
            />
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model="ICDexRouterVisible"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="router-modal"
      >
        <div class="mt20 router-modal-table">
          <a-spin :spinning="spinning">
            <table>
              <thead>
                <tr>
                  <th class="table-index">Index</th>
                  <th class="table-index">Type</th>
                  <th class="pl10">Event</th>
                  <th class="table-time text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in events" :key="index">
                  <td class="table-index">{{ item[0].toString(10) }}</td>
                  <td class="table-index">{{ Object.keys(item[1][0])[0] }}</td>
                  <td style="word-break: break-word" class="pl10">
                    {{ Object.values(item[1][0])[0] | filterJson }}
                  </td>
                  <td class="table-time text-right">
                    {{ item[1][1] | formatDateFromSecondUTC }}
                  </td>
                </tr>
                <tr v-show="!events.length">
                  <td class="text-center" colspan="4">No Data</td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <a-pagination
          v-if="eventTotal > 30"
          class="pagination"
          :defaultPageSize="30"
          :current="pageEvent"
          :total="eventTotal"
          @change="pageICDexRouterChange"
        />
      </a-modal>
      <a-modal
        v-model="ICDexRouterSeriousVisible"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="router-modal"
      >
        <div class="mt20 router-modal-table">
          <table>
            <thead>
              <tr>
                <th class="table-index">Index</th>
                <th class="table-index">Type</th>
                <th class="pl10">Event</th>
                <th class="table-time text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in seriousEvents.slice(
                  (pageSeriousEvent - 1) * 30,
                  pageSeriousEvent * 30
                )"
                :key="index"
              >
                <td class="table-index">{{ item[0].toString(10) }}</td>
                <td class="table-index">{{ Object.keys(item[1][0])[0] }}</td>
                <td style="word-break: break-word" class="pl10">
                  {{ Object.values(item[1][0])[0] | filterJson }}
                </td>
                <td class="table-time text-right">
                  {{ item[1][1] | formatDateFromSecondUTC }}
                </td>
              </tr>
              <tr v-show="!seriousEvents.length">
                <td class="text-center" colspan="4">No Data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          v-if="seriousEvents.length > 30"
          class="pagination"
          :defaultPageSize="30"
          :current="pageSeriousEvent"
          :total="seriousEvents.length"
          @change="pageICDexRouterSeriousChange"
        />
      </a-modal>
      <a-modal
        v-model="ICETHVisible"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="router-modal"
      >
        <div class="mt20 router-modal-table">
          <a-spin :spinning="spinningICETH">
            <table>
              <thead>
                <tr>
                  <th class="table-index">Index</th>
                  <th class="table-index">Type</th>
                  <th class="pl10">Event</th>
                  <th class="table-time text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in icETHEvents" :key="index">
                  <td class="table-index">{{ item[0].toString(10) }}</td>
                  <td class="table-index">{{ Object.keys(item[1][0])[0] }}</td>
                  <td style="word-break: break-word" class="pl10">
                    {{ Object.values(item[1][0])[0] | filterJson }}
                  </td>
                  <td class="table-time text-right">
                    {{ item[1][1] | formatDateFromSecondUTC }}
                  </td>
                </tr>
                <tr v-show="!icETHEvents.length">
                  <td class="text-center" colspan="4">No Data</td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <a-pagination
          v-if="eventIcETHTotal > 30"
          class="pagination"
          :defaultPageSize="30"
          :current="pageIcETHEvent"
          :total="eventIcETHTotal"
          @change="pageICETHChange"
        />
      </a-modal>
      <a-modal
        v-model="ICETHSeriousVisible"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="router-modal"
      >
        <div class="mt20 router-modal-table">
          <table>
            <thead>
              <tr>
                <th class="table-index">Index</th>
                <th class="table-index">Type</th>
                <th class="pl10">Event</th>
                <th class="table-time text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in icETHSeriousEvents.slice(
                  (pageSeriousICETHEvent - 1) * 30,
                  pageSeriousICETHEvent * 30
                )"
                :key="index"
              >
                <td class="table-index">{{ item[0].toString(10) }}</td>
                <td class="table-index">{{ Object.keys(item[1][0])[0] }}</td>
                <td style="word-break: break-word" class="pl10">
                  {{ Object.values(item[1][0])[0] | filterJson }}
                </td>
                <td class="table-time text-right">
                  {{ item[1][1] | formatDateFromSecondUTC }}
                </td>
              </tr>
              <tr v-show="!icETHSeriousEvents.length">
                <td class="text-center" colspan="4">No Data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          v-if="icETHSeriousEvents.length > 30"
          class="pagination"
          :defaultPageSize="30"
          :current="pageSeriousICETHEvent"
          :total="icETHSeriousEvents.length"
          @change="pageICETHSeriousChange"
        />
      </a-modal>
      <a-modal
        v-model="ICBTCVisible"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="router-modal"
      >
        <div class="mt20 router-modal-table">
          <a-spin :spinning="spinningICBTC">
            <table>
              <thead>
                <tr>
                  <th class="table-index">Index</th>
                  <th class="table-index">Type</th>
                  <th class="pl10">Event</th>
                  <th class="table-time text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in icBTCEvents" :key="index">
                  <td class="table-index">{{ item[0].toString(10) }}</td>
                  <td class="table-index">{{ Object.keys(item[1][0])[0] }}</td>
                  <td style="word-break: break-word" class="pl10">
                    {{ Object.values(item[1][0])[0] | filterJson }}
                  </td>
                  <td class="table-time text-right">
                    {{ item[1][1] | formatDateFromSecondUTC }}
                  </td>
                </tr>
                <tr v-show="!icBTCEvents.length">
                  <td class="text-center" colspan="4">No Data</td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <a-pagination
          v-if="eventIcBTCTotal > 30"
          class="pagination"
          :defaultPageSize="30"
          :current="pageIcBTCEvent"
          :total="eventIcBTCTotal"
          @change="pageICBTCChange"
        />
      </a-modal>
      <a-modal
        v-model="ICBTCSeriousVisible"
        width="90%"
        centered
        :footer="null"
        :keyboard="false"
        :maskClosable="false"
        class="router-modal"
      >
        <div class="mt20 router-modal-table">
          <table>
            <thead>
              <tr>
                <th class="table-index">Index</th>
                <th class="table-index">Type</th>
                <th class="pl10">Event</th>
                <th class="table-time text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in icBTCSeriousEvents.slice(
                  (pageSeriousICBTCEvent - 1) * 30,
                  pageSeriousICBTCEvent * 30
                )"
                :key="index"
              >
                <td class="table-index">{{ item[0].toString(10) }}</td>
                <td class="table-index">{{ Object.keys(item[1][0])[0] }}</td>
                <td style="word-break: break-word" class="pl10">
                  {{ Object.values(item[1][0])[0] | filterJson }}
                </td>
                <td class="table-time text-right">
                  {{ item[1][1] | formatDateFromSecondUTC }}
                </td>
              </tr>
              <tr v-show="!icBTCSeriousEvents.length">
                <td class="text-center" colspan="4">No Data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a-pagination
          v-if="icBTCSeriousEvents.length > 30"
          class="pagination"
          :defaultPageSize="30"
          :current="pageSeriousICBTCEvent"
          :total="icBTCSeriousEvents.length"
          @change="pageICBTCSeriousChange"
        />
      </a-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { DeployedSns } from '@/ic/SNSWasm/model';
import { SNSSwapService } from '@/ic/SNSSwap/SNSSwapService';
import {
  CanisterSummary,
  SnsCanistersSummaryResponse
} from '@/ic/SNSRoot/model';
import { SNSRootService } from '@/ic/SNSRoot/SNSRootService';
import BigNumber from 'bignumber.js';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import {
  GetMetadataResponse,
  ListProposals,
  ProposalData
} from '@/ic/SNSGovernance/model';
import { ICSwapRouterFiduciaryService } from '@/ic/ICSwapRouter/ICSwapRouterFiduciaryService';
import { PairsData } from '@/ic/ICSwapRouter/model';
import { Principal } from '@dfinity/principal';
import { AccountId, Time } from '@/ic/common/icType';
import { ICDexRouterService } from '@/ic/ICDexRouter/ICDexRouterService';
import axios from 'axios';
import { ICTCInfo } from '@/views/home/dashboard/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import {
  PairInfo,
  TOPoolResponse,
  TTErrorsResponse,
  TTsResponse
} from '@/ic/ICDex/model';
import { PoolInfo } from '@/ic/makerPool/model';
import { makerPoolService } from '@/ic/makerPool/makerPoolService';
import AccountInfo from '@/views/home/components/AccountInfo.vue';
import { BlockHeight, ICDexEvent } from '@/ic/ICDexRouter/model';
import { ckETHMinterService } from '@/ic/ckETHMinter/ckETHMinterService';
import { icETHEvent } from '@/ic/ckETHMinter/model';
import { BlackholeService } from '@/ic/blackhole/blackholeService';
import {
  gib_storage_per_second_fee_34,
  gib_storage_per_second_fee,
  readStateSubnet
} from '@/ic/readStateSubnet';
import { ckBTCMinterService } from '@/ic/ckbtcMinter/ckBTCMinterService';
import { icBTCEvent } from '@/ic/ckbtcMinter/model';
import { toHexString } from '@/ic/converter';
const ICLighthouseRoot = 'hjcnr-bqaaa-aaaaq-aacka-cai';
@Component({
  name: 'Index',
  components: {
    AccountInfo
  },
  filters: {
    filterJson(val): string {
      const res = JSON.stringify(val, (key, value) =>
        value instanceof Array && value.length >= 16 // todo 16
          ? toHexString(new Uint8Array(value))
          : typeof value === 'bigint'
          ? value.toString()
          : value && value['__principal__']
          ? value['__principal__']
          : value
      );
      return res;
    }
  }
})
export default class extends Vue {
  private SNSWasmService: SNSWasmService;
  private SNSSwapService: SNSSwapService;
  private SNSRootService: SNSRootService;
  private SNSGovernanceService: SNSGovernanceService;
  private ICSwapRouterFiduciaryService: ICSwapRouterFiduciaryService;
  private ICDexRouterService: ICDexRouterService;
  private ICDexService: ICDexService;
  private makerPoolService: makerPoolService;
  private ckETHMinterService: ckETHMinterService;
  private ckBTCMinterService: ckBTCMinterService;
  private SNSList: Array<DeployedSns> = [];
  private SNSDapps: Array<SnsCanistersSummaryResponse> = [];
  private SNSDappsForDappAll: {
    [key: string]: Array<SnsCanistersSummaryResponse>;
  } = {};
  private SNSDappsForDapp: {
    [key: string]: Array<SnsCanistersSummaryResponse>;
  } = {};
  private SNSMetadata: { [key: string]: GetMetadataResponse } = {};
  private SNSMetadataList: Array<GetMetadataResponse> = [];
  private page = 1;
  private snsNumber = 0;
  private canistersNum = 0;
  private stopped = 0;
  private insufficient = 0;
  private snsNumberProposals = 0;
  private proposals = 0;
  private open = 0;
  private SNSCanistersVisible = false;
  private currentSNS = '';
  private currentRoot = '';
  private pairs: Array<PairsData> = [];
  private pools: Array<[Principal, Array<[Principal, AccountId]>]> = [];
  private totalTVL = '';
  private totalVol = '';
  private Vol24 = '';
  private pageEvent = 1;
  private eventTotal = 0;
  private spinning = false;
  private spinningICETH = false;
  private spinningICBTC = false;
  private pageIcETHEvent = 1;
  private eventIcETHTotal = 0;
  private pageIcBTCEvent = 1;
  private eventIcBTCTotal = 0;
  private pageSeriousEvent = 1;
  private pageSeriousICETHEvent = 1;
  private pageSeriousICBTCEvent = 1;
  private icETHEvents: Array<[BlockHeight, [icETHEvent, Time]]> = [];
  private icETHSeriousEvents: Array<[BlockHeight, [icETHEvent, Time]]> = [];
  private events: Array<[BlockHeight, [ICDexEvent, Time]]> = [];
  private seriousEvents: Array<[BlockHeight, [ICDexEvent, Time]]> = [];
  private icBTCEvents: Array<[BlockHeight, [icBTCEvent, Time]]> = [];
  private icBTCSeriousEvents: Array<[BlockHeight, [icBTCEvent, Time]]> = [];
  private ICTC: ICTCInfo = null;
  private pageICDexCanisters = 1;
  private ICDexCanistersVisible = false;
  private ICDexCanisters: Array<
    [
      (
        | { pairId: string; pairInfo: PairInfo }
        | { poolId: string; poolInfo: PoolInfo }
      ),
      bigint,
      TTsResponse,
      TTErrorsResponse,
      TOPoolResponse
    ]
  > = [];
  private currentICDexCanisters: Array<
    [
      (
        | { pairId: string; pairInfo: PairInfo }
        | { poolId: string; poolInfo: PoolInfo }
      ),
      bigint,
      TTsResponse,
      TTErrorsResponse,
      TOPoolResponse
    ]
  > = [];
  private blackholeService: BlackholeService;
  private ICDexRouterVisible = false;
  private ICDexRouterSeriousVisible = false;
  private ICETHVisible = false;
  private ICETHSeriousVisible = false;
  private ICBTCVisible = false;
  private ICBTCSeriousVisible = false;
  created(): void {
    this.SNSWasmService = new SNSWasmService();
    this.SNSSwapService = new SNSSwapService();
    this.SNSRootService = new SNSRootService();
    this.SNSGovernanceService = new SNSGovernanceService();
    this.ICSwapRouterFiduciaryService = new ICSwapRouterFiduciaryService();
    this.ICDexRouterService = new ICDexRouterService();
    this.ICDexService = new ICDexService();
    this.makerPoolService = new makerPoolService();
    this.ckETHMinterService = new ckETHMinterService();
    this.blackholeService = new BlackholeService();
    this.ckBTCMinterService = new ckBTCMinterService();
    this.getSNSList();
    this.getPairs().then(() => {
      this.getPools([], 1);
    });
    this.getTVL();
    this.getVol();
    this.getEvents();
    this.getSeriousEvents();
    this.getIcETHEvents();
    this.getIcETHSeriousEvents();
    this.getIcBTCEvents();
    this.getIcBTCSeriousEvents();
  }
  private async getIcBTCSeriousEvents(page = 1): Promise<void> {
    const res = await this.ckBTCMinterService.get_events(
      'icBTC',
      [BigInt(page)],
      [BigInt(100)]
    );
    if (res && res.data && res.data.length) {
      res.data.forEach((item) => {
        const type = Object.keys(item[1][0])[0];
        if (type.toLocaleLowerCase().includes('suspend')) {
          this.icBTCSeriousEvents.push(item);
        }
      });
      if (page < Number(res.totalPage)) {
        this.getIcBTCSeriousEvents(++page);
      }
    }
  }
  private async getIcBTCEvents(): Promise<void> {
    this.spinningICBTC = true;
    const res = await this.ckBTCMinterService.get_events(
      'icBTC',
      [BigInt(this.pageIcBTCEvent)],
      [BigInt(30)]
    );
    if (res && res.data && res.data.length) {
      this.icBTCEvents = res.data;
      if (!this.eventIcBTCTotal) {
        this.eventIcBTCTotal = Number(res.total);
      }
    } else {
      this.icBTCEvents = [];
    }
    this.spinningICBTC = false;
  }
  private async getIcETHSeriousEvents(page = 1): Promise<void> {
    const res = await this.ckETHMinterService.get_events(
      [BigInt(page)],
      [BigInt(100)]
    );
    if (res && res.data && res.data.length) {
      res.data.forEach((item) => {
        const type = Object.keys(item[1][0])[0];
        if (type.toLocaleLowerCase().includes('suspend')) {
          this.icETHSeriousEvents.push(item);
        }
      });
      if (page < Number(res.totalPage)) {
        this.getIcETHSeriousEvents(++page);
      }
    }
  }
  private async getIcETHEvents(): Promise<void> {
    this.spinningICETH = true;
    const res = await this.ckETHMinterService.get_events(
      [BigInt(this.pageIcETHEvent)],
      [BigInt(30)]
    );
    if (res && res.data && res.data.length) {
      this.icETHEvents = res.data;
      if (!this.eventIcETHTotal) {
        this.eventIcETHTotal = Number(res.total);
      }
    } else {
      this.icETHEvents = [];
    }
    this.spinningICETH = false;
  }
  private async getSeriousEvents(page = 1): Promise<void> {
    const res = await this.ICDexRouterService.get_events(
      [BigInt(page)],
      [BigInt(100)]
    );
    if (res && res.data && res.data.length) {
      res.data.forEach((item) => {
        const type = Object.keys(item[1][0])[0];
        if (type.toLocaleLowerCase().includes('suspend')) {
          this.seriousEvents.push(item);
        }
      });
      if (page < Number(res.totalPage)) {
        this.getSeriousEvents(++page);
      }
    }
  }
  private async getEvents(): Promise<void> {
    this.spinning = true;
    const res = await this.ICDexRouterService.get_events(
      [BigInt(this.pageEvent)],
      [BigInt(30)]
    );
    if (res && res.data && res.data.length) {
      this.events = res.data;
      if (!this.eventTotal) {
        this.eventTotal = Number(res.total);
      }
    } else {
      this.events = [];
    }
    this.spinning = false;
  }
  private pageICDexRouterChange(page: number): void {
    this.pageEvent = page;
    this.getEvents();
  }
  private pageICETHChange(page: number): void {
    this.pageIcETHEvent = page;
    this.getIcETHEvents();
  }
  private pageICBTCChange(page: number): void {
    this.pageIcBTCEvent = page;
    this.getIcBTCEvents();
  }
  private pageICDexRouterSeriousChange(page: number): void {
    this.pageSeriousEvent = page;
  }
  private pageICETHSeriousChange(page: number): void {
    this.pageSeriousICETHEvent = page;
  }
  private pageICBTCSeriousChange(page: number): void {
    this.pageSeriousICBTCEvent = page;
  }
  private async getVol(): Promise<void> {
    let total = '0';
    let Vol24 = '0';
    try {
      const res = await axios.get(
        'https://gwhbq-7aaaa-aaaar-qabya-cai.raw.icp0.io/v1/latest'
      );
      if (res && res.data) {
        for (let key in res.data) {
          const totalVol = res.data[key].usd_volume;
          Vol24 = new BigNumber(Vol24)
            .plus(res.data[key].usd_24h_volume)
            .toString(10);
          total = new BigNumber(total).plus(totalVol).toString(10);
        }
      }
    } catch (e) {}
    this.totalVol = new BigNumber(total).decimalPlaces(0).toString(10);
    this.Vol24 = new BigNumber(Vol24).decimalPlaces(0).toString(10);
  }
  private async getTVL(): Promise<void> {
    try {
      const res = await axios.get(
        'https://gwhbq-7aaaa-aaaar-qabya-cai.raw.icp0.io/v1/pools/tvls'
      );
      let total = '0';
      if (res && res.data && res.data.pairs) {
        res.data.pairs.forEach((res) => {
          if (res.pair && !res.pair.toLocaleString().includes('test')) {
            total = new BigNumber(total).plus(res.tvl).toString(10);
            // this.pairsTVL[res.pairId] = res.tvl;
          }
        });
        this.totalTVL = new BigNumber(total).decimalPlaces(0).toString(10);
      }
    } catch (e) {}
  }
  private async getPools(
    pools: Array<[Principal, Array<[Principal, AccountId]>]>,
    page: number
  ): Promise<void> {
    let pair = [];
    const res = await this.ICDexRouterService.maker_getPublicMakers(
      pair,
      [BigInt(page)],
      [BigInt(100)]
    );
    if (res && res.data && res.data.length) {
      pools = pools.concat(res.data);
    } else {
      res.total = BigInt(0);
    }
    if (pools.length < Number(res.total)) {
      await this.getPools(pools, ++page);
    } else {
      pools.forEach((pool) => {
        pool[1].forEach((item) => {
          this.pools.unshift([pool[0], [item]]);
        });
      });
      this.getICTC();
    }
  }
  private async getICTC(): Promise<void> {
    const pools = [];
    const pairs = [];
    const promiseValue = [];
    this.pairs.forEach((pair) => {
      promiseValue.push(
        this.getPairInfo(pair[0].toString()),
        this.ictc_getTOCount(pair[0].toString()),
        this.ictc_getTTs(pair[0].toString()),
        this.ictc_getTTErrors(pair[0].toString()),
        this.ictc_getTOPool(pair[0].toString())
      );
    });
    const res = await Promise.all(promiseValue);
    let chunk = [];
    const chunkSize = 5;
    res.forEach((item, index) => {
      chunk.push(item);
      if (chunk.length === chunkSize || index === res.length - 1) {
        pairs.push(chunk);
        chunk = [];
      }
    });
    const promiseValuePool = [];
    this.pools.forEach((pool) => {
      promiseValuePool.push(
        this.getPoolInfo(pool[1][0][0].toString()),
        this.pool_ictc_getTOCount(pool[1][0][0].toString()),
        this.pool_ictc_getTTs(pool[1][0][0].toString()),
        this.pool_ictc_getTTErrors(pool[1][0][0].toString()),
        this.pool_ictc_getTOPool(pool[1][0][0].toString())
      );
    });
    const resPool = await Promise.all(promiseValuePool);
    let chunkPool = [];
    const chunkSizePool = 5;
    resPool.forEach((item, index) => {
      chunkPool.push(item);
      if (chunkPool.length === chunkSizePool || index === resPool.length - 1) {
        pools.push(chunkPool);
        chunkPool = [];
      }
    });
    let paused = 0;
    let TOs = 0;
    let TTs = 0;
    let TTErrors = 0;
    let TOBlocking = 0;
    let pausedOAMM = 0;
    let TOBlockingOAMM = 0;
    pairs.forEach(
      (
        pair: [
          { pairId: string; pairInfo: PairInfo },
          bigint,
          TTsResponse,
          TTErrorsResponse,
          TOPoolResponse
        ]
      ) => {
        if (pair[0] && pair[0].pairInfo.paused) {
          ++paused;
        }
        TOs = TOs + Number(pair[1]);
        TTs = TTs + Number(pair[2].total);
        TTErrors = TTErrors + Number(pair[3].total);
        if (pair[4]) {
          pair[4].forEach((item) => {
            if (item[1] && item[1][0]) {
              const type = Object.keys(item[1][0].status)[0];
              if (type === 'Blocking') {
                ++TOBlocking;
              }
            }
          });
        }
      }
    );
    pools.forEach(
      (
        pool: [
          { poolId: string; poolInfo: PoolInfo },
          bigint,
          TTsResponse,
          TTErrorsResponse,
          TOPoolResponse
        ]
      ) => {
        if (pool[0] && pool[0].poolInfo.paused) {
          ++pausedOAMM;
        }
        TOs = TOs + Number(pool[1]);
        TTs = TTs + Number(pool[2].total);
        TTErrors = TTErrors + Number(pool[3].total);
        if (pool[4]) {
          pool[4].forEach((item) => {
            if (item[1] && item[1][0]) {
              const type = Object.keys(item[1][0].status)[0];
              if (type === 'Blocking') {
                ++TOBlockingOAMM;
              }
            }
          });
        }
      }
    );
    this.ICTC = {
      paused: paused,
      TOs: TOs,
      TTs: TTs,
      TOBlocking: TOBlocking,
      TTErrors: TTErrors,
      pausedOAMM: pausedOAMM,
      TOBlockingOAMM: TOBlockingOAMM
    };
    this.ICDexCanisters = pairs.concat(pools);
  }
  private getBlocking(val: TOPoolResponse): number {
    let num = 0;
    val.forEach((item) => {
      if (item[1] && item[1][0]) {
        const type = Object.keys(item[1][0].status)[0];
        if (type === 'Blocking') {
          ++num;
        }
      }
    });
    return num;
  }
  private async getPoolInfo(
    poolId: string
  ): Promise<{ poolId: string; poolInfo: PoolInfo }> {
    const res = await this.makerPoolService.info(poolId);
    return {
      poolId: poolId,
      poolInfo: res
    };
  }
  private async pool_ictc_getTOPool(pairId: string): Promise<TOPoolResponse> {
    return await this.makerPoolService.ictc_getTOPool(pairId);
  }
  private async pool_ictc_getTTErrors(
    pairId: string
  ): Promise<TTErrorsResponse> {
    return await this.makerPoolService.ictc_getTTErrors(
      pairId,
      BigInt(1),
      BigInt(1)
    );
  }
  private async pool_ictc_getTTs(pairId: string): Promise<TTsResponse> {
    return await this.makerPoolService.ictc_getTTs(
      pairId,
      BigInt(1),
      BigInt(1)
    );
  }
  private async pool_ictc_getTOCount(pairId: string): Promise<bigint> {
    return await this.makerPoolService.ictc_getTOCount(pairId);
  }
  private async ictc_getTOPool(pairId: string): Promise<TOPoolResponse> {
    return await this.ICDexService.ictc_getTOPool(pairId);
  }
  private async ictc_getTTErrors(pairId: string): Promise<TTErrorsResponse> {
    return await this.ICDexService.ictc_getTTErrors(
      pairId,
      BigInt(1),
      BigInt(1)
    );
  }
  private async ictc_getTTs(pairId: string): Promise<TTsResponse> {
    return await this.ICDexService.ictc_getTTs(pairId, BigInt(1), BigInt(1));
  }
  private async ictc_getTOCount(pairId: string): Promise<bigint> {
    return await this.ICDexService.ictc_getTOCount(pairId);
  }
  private async getPairInfo(
    id: string
  ): Promise<{ pairId: string; pairInfo: PairInfo }> {
    return this.ICDexService.info(id);
  }
  private async getPairs(): Promise<void> {
    const res = await this.ICSwapRouterFiduciaryService.getPairs(
      ['icdex'],
      [],
      []
    );
    if (res && res.data) {
      this.pairs = res.data;
    }
  }
  private async getSNSList(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const SNSList = await this.SNSWasmService.listDeployedSnses();
    const promiseValue = [];
    SNSList.forEach((item) => {
      if (item.root_canister_id[0].toString() === ICLighthouseRoot) {
        this.SNSList = [item];
        promiseValue.push(
          this.get_sns_canisters_summary(
            item.root_canister_id[0].toString(),
            loading
          )
        );
        this.getProposalsInfo(item.governance_canister_id[0].toString());
        this.getOpening(item.governance_canister_id[0].toString(), null, 0);
        this.getMetadata(
          item.governance_canister_id[0].toString(),
          item.root_canister_id[0].toString()
        );
      }
    });
    const moreApps = [
      {
        type: 'DRC202Root',
        canister_id: 'bffvb-aiaaa-aaaak-ae3ba-cai'
      },
      {
        type: 'DRC205Root',
        canister_id: 'lw5dr-uiaaa-aaaak-ae2za-cai'
      },
      {
        type: 'AccountIdData',
        canister_id: 'gpapk-hqaaa-aaaak-aex4q-cai'
      },
      {
        type: 'ICTokensMain',
        canister_id: 'igm6s-dqaaa-aaaar-qaa3a-cai'
      },
      {
        type: 'ICHouseList',
        canister_id: 'ytcww-qyaaa-aaaak-aacra-cai'
      },
      {
        type: 'ICLTeam',
        canister_id: 'zseoz-qqaaa-aaaap-abzxa-cai'
      },
      {
        type: 'CMC',
        canister_id: 'gwhbq-7aaaa-aaaar-qabya-cai'
      },
      {
        type: 'SNSTracker',
        canister_id: 'cdve5-wiaaa-aaaak-akoua-cai'
      },
      {
        type: 'SNSTracker',
        canister_id: 'cdve5-wiaaa-aaaak-akoua-cai'
      },
      {
        type: 'Orcale',
        canister_id: 'pncff-zqaaa-aaaai-qnp3a-cai'
      },
      {
        type: 'ICHouse',
        canister_id: '637g5-siaaa-aaaaj-aasja-cai'
      },
      {
        type: 'ICTC',
        canister_id: 'cmqwp-uiaaa-aaaaj-aihzq-cai'
      }
    ];
    moreApps.forEach((item) => {
      promiseValue.push(
        this.readStatus({
          root: this.SNSList[0].root_canister_id[0].toString(),
          ...item
        })
      );
    });
    await Promise.all(promiseValue);
  }
  private async getMetadata(governance: string, root: string): Promise<void> {
    const res = await this.SNSGovernanceService.getMetadata(governance);
    this.$set(this.SNSMetadata, root, res);
    this.SNSMetadataList.push({ root: root, ...res });
    if (this.SNSMetadataList.length === this.SNSList.length) {
      this.SNSMetadataList.sort((a, b) => {
        return a.name[0].localeCompare(b.name[0]);
      });
      this.currentSNS = this.SNSMetadataList[0].name[0];
      this.currentRoot = this.SNSMetadataList[0].root;
    }
  }
  private async getProposalsInfo(governance: string): Promise<void> {
    const totalRequest: ListProposals = {
      before_proposal: [],
      limit: BigInt(1),
      exclude_type: [],
      include_status: [],
      include_topics: [],
      include_reward_status: []
    };
    this.SNSGovernanceService.listProposals(governance, totalRequest).then(
      (res) => {
        let num = 0;
        if (res && res.proposals && res.proposals.length) {
          num = Number(res.proposals[0].id[0].id);
        }
        this.proposals = this.proposals + num;
      }
    );
  }
  private async getOpening(
    governance: string,
    lastProposals: ProposalData,
    open: number
  ): Promise<void> {
    let beforeProposal = [];
    if (lastProposals) {
      beforeProposal = lastProposals.id;
    }
    // open:1
    const openRequest: ListProposals = {
      before_proposal: beforeProposal,
      limit: BigInt(10),
      exclude_type: [],
      include_status: [1],
      include_topics: [],
      include_reward_status: []
    };
    this.SNSGovernanceService.listProposals(governance, openRequest)
      .then((res) => {
        if (res && res.proposals && res.proposals.length) {
          open += res.proposals.length;
          if (res.proposals.length === 10) {
            this.getOpening(
              governance,
              res.proposals[res.proposals.length - 1],
              open
            );
          } else {
            this.open = this.open + open;
          }
        } else {
          this.open = this.open + open;
        }
      })
      .finally(() => {
        ++this.snsNumberProposals;
      });
  }
  private async readStatus(val: {
    type: string;
    canister_id: string;
    root: string;
  }): Promise<void> {
    const res = await Promise.all([
      readStateSubnet(val.canister_id),
      this.blackholeService.canister_status({
        canister_id: Principal.fromText(val.canister_id)
      })
    ]);
    if (res && res.length && res[0].subnetId && res[1]) {
      ++this.canistersNum;
      let gibStoragePerSecondFee = gib_storage_per_second_fee;
      if (res[0].nodeKeys.size === 34) {
        gibStoragePerSecondFee = gib_storage_per_second_fee_34;
      }
      const idle_cycles_burned_per_day = BigInt(
        new BigNumber(res[1].memory_size.toString(10))
          .plus(res[1].settings.memory_allocation.toString(10))
          .plus(res[1].settings.compute_allocation.toString(10))
          .times(gibStoragePerSecondFee) // GIB
          .times(24 * 60 * 60) // day
          .div(1024 * 1024 * 1024) // div GIB
          .decimalPlaces(0)
          .toString(10)
      );
      const dapp: SnsCanistersSummaryResponse = {
        type: val.type,
        root: '',
        canister_id: [Principal.fromText(val.canister_id)],
        status: [
          {
            idle_cycles_burned_per_day: idle_cycles_burned_per_day,
            status: res[1].status,
            cycles: res[1].cycles,
            memory_size: res[1].memory_size,
            module_hash: res[1].module_hash as [number[]],
            settings: res[1].settings
          }
        ]
      };
      const min = new BigNumber(5 * 10 ** 12);
      if (min.gt(res[1].cycles.toString(10))) {
        ++this.insufficient;
      }
      this.SNSDapps.unshift(dapp);
      if (!this.SNSDappsForDappAll[val.root]) {
        this.SNSDappsForDappAll[val.root] = [];
      }
      this.SNSDappsForDappAll[val.root].push(dapp);
    }
  }
  private async get_sns_canisters_summary(
    root: string,
    loading
  ): Promise<void> {
    const res = await this.SNSRootService.get_sns_canisters_summary(root);
    ++this.snsNumber;
    if (res) {
      for (let key in res) {
        res[key].forEach((item: CanisterSummary) => {
          ++this.canistersNum;
          this.SNSDapps.unshift({
            type: key,
            root: root,
            ...item
          });
          if (!this.SNSDappsForDappAll[root]) {
            this.SNSDappsForDappAll[root] = [];
          }
          this.SNSDappsForDappAll[root].push({
            type: key,
            root: root,
            ...item
          });
          if (item.status && item.status.length) {
            const type = Object.keys(item.status[0].status)[0];
            if (type === 'stopped') {
              ++this.stopped;
            }
            // 5T
            const min = new BigNumber(5 * 10 ** 12);
            if (min.gt(item.status[0].cycles.toString(10))) {
              ++this.insufficient;
            }
          }
        });
      }
    }
    if (this.snsNumber && this.SNSList.length === this.snsNumber) {
      loading.close();
    }
  }
  private changeSNS(val: GetMetadataResponse): void {
    this.currentSNS = val.name[0];
    this.currentRoot = val.root;
  }
  private async getLifecycle(item: DeployedSns): Promise<boolean> {
    const res = await this.SNSSwapService.getLifecycle(
      item.swap_canister_id[0].toString()
    );
    return (
      res &&
      res.lifecycle &&
      res.lifecycle.length &&
      Number(res.lifecycle[0]) == 3
    );
  }
  private pageChange(page: number): void {
    this.page = page;
  }
  private pageICDexCanistersChange(page: number): void {
    this.pageICDexCanisters = page;
  }
  private showICDexRouterEvents(): void {
    this.ICDexRouterVisible = true;
    this.pageEvent = 1;
    this.getEvents();
  }
  private showICETHEvents(): void {
    this.ICETHVisible = true;
    this.pageIcETHEvent = 1;
    this.getIcETHEvents();
  }
  private showICBTCEvents(): void {
    this.ICBTCVisible = true;
    this.pageIcBTCEvent = 1;
    this.getIcBTCEvents();
  }
  private showICDexRouterSeriousEvents(): void {
    this.ICDexRouterSeriousVisible = true;
    this.pageSeriousEvent = 1;
  }
  private showICETHSeriousEvents(): void {
    this.ICETHSeriousVisible = true;
    this.pageSeriousICETHEvent = 1;
  }
  private showICBTCSeriousEvents(): void {
    this.ICBTCSeriousVisible = true;
    this.pageSeriousICBTCEvent = 1;
  }
  private showICDexCanisters(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters;
    this.ICDexCanistersVisible = true;
  }
  private showTradingPairs(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters.filter((item) => {
      if ((item[0] as { pairId: string; pairInfo: PairInfo }).pairId) {
        return true;
      }
    });
    this.ICDexCanistersVisible = true;
  }
  private showTradingPairsPaused(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters.filter((item) => {
      if ((item[0] as { pairId: string; pairInfo: PairInfo }).pairId) {
        if (
          (item[0] as { pairId: string; pairInfo: PairInfo }).pairInfo.paused
        ) {
          return true;
        }
      }
    });
    this.ICDexCanistersVisible = true;
  }
  private showTradingPoolsPaused(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters.filter((item) => {
      if ((item[0] as { poolId: string; poolInfo: PoolInfo }).poolId) {
        if (
          (item[0] as { poolId: string; poolInfo: PoolInfo }).poolInfo.paused
        ) {
          return true;
        }
      }
    });
    this.ICDexCanistersVisible = true;
  }
  private showTradingPairsBlocking(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters.filter((item) => {
      if ((item[0] as { pairId: string; pairInfo: PairInfo }).pairId) {
        let flag = false;
        if (item[4]) {
          for (let i = 0; i < item[4].length; i++) {
            if (item[4][i][1] && item[4][i][1][0]) {
              const type = Object.keys(item[4][i][1][0].status)[0];
              if (type === 'Blocking') {
                flag = true;
                break;
              }
            }
          }
        }
        return flag;
      }
    });
    this.ICDexCanistersVisible = true;
  }
  private showTradingPoolsBlocking(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters.filter((item) => {
      if ((item[0] as { poolId: string; poolInfo: PoolInfo }).poolId) {
        let flag = false;
        if (item[4]) {
          for (let i = 0; i < item[4].length; i++) {
            if (item[4][i][1] && item[4][i][1][0]) {
              const type = Object.keys(item[4][i][1][0].status)[0];
              if (type === 'Blocking') {
                flag = true;
                break;
              }
            }
          }
        }
        return flag;
      }
    });
    this.ICDexCanistersVisible = true;
  }
  private showTradingPools(): void {
    this.pageICDexCanisters = 1;
    this.currentICDexCanisters = this.ICDexCanisters.filter((item) => {
      if ((item[0] as { poolId: string; poolInfo: PoolInfo }).poolId) {
        return true;
      }
    });
    this.ICDexCanistersVisible = true;
  }
  private showSNSDappsForDappAll(): void {
    this.SNSDappsForDapp[this.currentRoot] =
      this.SNSDappsForDappAll[this.currentRoot];
    this.SNSCanistersVisible = true;
  }
  private showStopped(): void {
    this.SNSDappsForDapp[this.currentRoot] = this.SNSDappsForDappAll[
      this.currentRoot
    ].filter((item) => {
      if (item.status && item.status.length) {
        const type = Object.keys(item.status[0].status)[0];
        return type === 'stopped';
      }
    });
    this.SNSCanistersVisible = true;
  }
  private showInsufficient(): void {
    this.SNSDappsForDapp[this.currentRoot] = this.SNSDappsForDappAll[
      this.currentRoot
    ].filter((item) => {
      if (item.status && item.status.length) {
        // 5T
        const min = new BigNumber(5 * 10 ** 12);
        return min.gt(item.status[0].cycles.toString(10));
      }
    });
    this.SNSCanistersVisible = true;
  }
}
</script>
<style scoped lang="scss">
.dashboard-main {
  margin-top: 40px;
  .dashboard-sns-main,
  .dashboard-icdex-main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #131920;
    padding: 30px 16px;
    border-radius: 8px;
    .dashboard-sns-item {
      width: 50%;
    }
  }
  .dashboard-sns-item-bold {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }
}
.canisters-modal {
  position: relative;
  padding-bottom: 55px;
  .nft-main-pagination {
    position: absolute;
    right: 0;
  }
}
.router-modal {
  table {
    min-height: 50px;
  }
  .router-modal-table {
    overflow: auto;
    max-height: calc(100vh - 240px);
  }
  ::v-deep .ant-modal-body {
    padding-bottom: 50px;
    .pagination {
      position: absolute;
      right: 30px;
      margin-top: 20px;
    }
  }
}
/*.position-pagination {*/
/*	float: right;*/
/*	margin-top: 20px;*/
/*}*/
.router-modal {
  /**/
  /*.nft-main-pagination {*/
  /*  position: absolute;*/
  /*  right: 0;*/
  /*}*/
  td {
    padding: 15px 0;
    vertical-align: middle;
  }
  .table-index {
    width: 100px;
  }
  .table-time {
    width: 200px;
  }
  .pl10 {
    padding-left: 10px;
  }
}
.user-setting {
  ::v-deep .ant-dropdown-menu-item {
    padding: 0;
    &:hover {
      background: rgba(255, 255, 255, 0.08);
      .user-principal {
        color: #51b7c3;
      }
      i {
        color: #51b7c3;
      }
    }
  }
}
.user-setting-item {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 8px 15px !important;
  border-bottom: 1px solid #383e4e;
  cursor: pointer;
  &:hover,
  &.active {
    background: rgba(255, 255, 255, 0.08);
    color: #51b7c3;
  }
  &:last-child {
    border-bottom: none;
  }
}
.user-menu {
  font-size: 16px;
  color: #fff;
}
.dashboard-data-title {
  font-size: 16px;
  color: #adb3c4;
}
.ictc-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 90px;
  font-size: 15px;
  .ictc-item {
    &:first-child {
      > div {
        padding-right: 80px;
      }
    }
    &.ictc-item-s {
      > div {
        padding: 0 80px;
      }
    }
    > div {
      display: flex;
      align-items: center;
      height: 20px;
      margin: 5px 0;
      border-right: 1px solid #5e6170;
    }
    &:last-child {
      > div {
        border-right: none;
      }
    }
  }
}
.dashboard-data-main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  height: 160px;
  background: #131920;
  .dashboard-data-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 120px;
    border-right: 1px solid #5e6170;
    &:last-child {
      border-right: none;
    }
    dt {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    dd {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
.canisters-modal {
  table {
    td {
      padding: 0;
      a {
        display: block;
        padding: 5px;
      }
    }
  }
}
.home-header {
  margin-top: 14px;
}
</style>
<style lang="scss">
.canisters-modal-dropdown {
  max-height: 400px;
  min-width: auto !important;
  overflow: auto;
}
</style>
