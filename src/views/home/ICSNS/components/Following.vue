<template>
  <div>
    <a-modal
      v-model="visible"
      centered
      title="Follow Neurons"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="follow-neurons-modal"
      :after-close="afterCloseFollow"
    >
      <div>
        <div class="base-font-tip">
          As an alternative to voting manually, you can delegate your voting
          power to other neurons. To cover all proposals, make sure delegation
          is set for each topic.
        </div>
        <div class="follow-Neuron-list">
          <p class="follow-Neuron-list-title">Currently Following</p>
          <div
            class="follow-Neuron-list-ul-main"
            v-if="
              neuron &&
              neuron.topic_followees &&
              neuron.topic_followees[0] &&
              neuron.topic_followees[0].topic_id_to_followees &&
              neuron.topic_followees[0].topic_id_to_followees.length
            "
          >
            <ul
              class="follow-Neuron-list-item"
              v-for="item in neuron.topic_followees[0].topic_id_to_followees"
              :key="item[0]"
            >
              <li>
                <div
                  v-if="item[1].topic.length"
                  class="follow-Neuron-list-item-name"
                >
                  {{ Object.keys(item[1].topic[0])[0] }}
                </div>
                <div class="follow-Neuron-list-item-ids">
                  <div
                    v-for="(followee, index) in item[1].followees"
                    :key="index"
                  >
                    <a-tooltip placement="top" v-if="followee.neuron_id[0]">
                      <template slot="title">
                        {{ arrayToString(followee.neuron_id[0].id) }}
                      </template>
                      <span
                        v-show="
                          SNSNeurons &&
                          ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'SNS1' &&
                            arrayToString(followee.neuron_id[0].id) ===
                              sns1Id) ||
                            (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'CHAT' &&
                              arrayToString(followee.neuron_id[0].id) ===
                                chatId) ||
                            (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'ICL' &&
                              arrayToString(followee.neuron_id[0].id) ===
                                ICLId))
                        "
                        class="follow-Neuron-list-item-id"
                      >
                        ICLighthouse
                      </span>
                      <span
                        v-show="
                          !(
                            SNSNeurons &&
                            ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'SNS1' &&
                              arrayToString(followee.neuron_id[0].id) ===
                                sns1Id) ||
                              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                                'CHAT' &&
                                arrayToString(followee.neuron_id[0].id) ===
                                  chatId) ||
                              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                                'ICL' &&
                                arrayToString(followee.neuron_id[0].id) ===
                                  ICLId))
                          )
                        "
                        class="follow-Neuron-list-item-id"
                      >
                        {{
                          arrayToString(followee.neuron_id[0].id) |
                            ellipsisAccount(6)
                        }}
                      </span>
                    </a-tooltip>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else>No followees</div>
        </div>
        <p class="add-remove-title">
          Add/Remove followees
          <button
            v-if="
              neuron &&
              neuron.topic_followees &&
              neuron.topic_followees.length &&
              neuron.topic_followees[0].topic_id_to_followees &&
              neuron.topic_followees[0].topic_id_to_followees.length
            "
            class="margin-left-auto primary"
            type="button"
            @click="deleteAllFollowee"
          >
            Remove All
          </button>
          <button
            v-else
            class="margin-left-auto primary"
            type="button"
            @click="onAddAllFollowee"
          >
            Add All
          </button>
        </p>
        <a-collapse
          v-if="
            SNSNeurons &&
            SNSNeurons.listTopics &&
            SNSNeurons.listTopics.topics &&
            SNSNeurons.listTopics.topics[0]
          "
          expand-icon-position="right"
          class="follow-collapse-panel-main"
          v-model="activeKey"
        >
          <a-collapse-panel
            v-for="(list, index) in SNSNeurons.listTopics.topics[0]"
            :key="index.toString(10)"
            class="follow-collapse-panel-item"
          >
            <div slot="header">
              <div class="follow-collapse-panel-header">
                <div>
                  <p class="system-name">{{ list.name[0] }}</p>
                  <div class="system-description">
                    {{ list.description[0] }}
                  </div>
                </div>
                <span class="follow-number">
                  {{ list | filterFolloweesNumber(followees) }}
                </span>
              </div>
            </div>
            <div>
              <p>Currently Following</p>
              <ul
                v-if="
                  followees[Object.keys(list.topic[0])[0]] &&
                  followees[Object.keys(list.topic[0])[0]].length
                "
                class="followees-main"
              >
                <li
                  v-for="(followee, index) in followees[
                    Object.keys(list.topic[0])[0]
                  ]"
                  :key="index"
                  class="followees-item"
                >
                  <span
                    v-show="
                      SNSNeurons &&
                      ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1' &&
                        arrayToString(followee.id) === sns1Id) ||
                        (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT' &&
                          arrayToString(followee.id) === chatId) ||
                        (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'ICL' &&
                          arrayToString(followee.id) === ICLId))
                    "
                  >
                    ICLighthouse
                    <a-icon
                      type="copy"
                      @click.stop.prevent
                      v-clipboard:copy="arrayToString(followee.id)"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                    />
                  </span>
                  <copy-account
                    v-show="
                      !(
                        SNSNeurons &&
                        ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                          'SNS1' &&
                          arrayToString(followee.id) === sns1Id) ||
                          (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'CHAT' &&
                            arrayToString(followee.id) === chatId) ||
                          (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'ICL' &&
                            arrayToString(followee.id) === ICLId))
                      )
                    "
                    :front="8"
                    :account="arrayToString(followee.id)"
                    copy-text="Neuron ID"
                  ></copy-account>
                  <span class="margin-left-auto">
                    <a-icon
                      @click="deleteFollowee(list, arrayToString(followee.id))"
                      type="close"
                    />
                  </span>
                </li>
              </ul>
              <div class="add-followee-button mt20">
                <button
                  type="button"
                  class="primary"
                  @click="onAddFollowee(list)"
                >
                  Add Followee
                </button>
              </div>
            </div>
          </a-collapse-panel>
          <!--<a-collapse-panel class="follow-collapse-panel-main-advanced">
            <div slot="header" class="base-color-w">Advanced</div>
            <a-collapse
              v-if="
                SNSNeurons &&
                SNSNeurons.listTopics &&
                SNSNeurons.listTopics.topics &&
                SNSNeurons.listTopics.topics[0]
              "
              expand-icon-position="right"
              class="follow-collapse-panel-main"
              v-model="activeKeyAdvanced"
            >
              <a-collapse-panel
                v-for="(list, index) in SNSNeurons.listTopics.topics[0]"
                :key="index"
                class="follow-collapse-panel-item"
              >
                <div slot="header">
                  <div class="follow-collapse-panel-header">
                    <div>
                      <p class="system-name">{{ list.name[0] }}</p>
                      <div class="system-description">
                        {{ list.description[0] }}
                      </div>
                    </div>
                    <span class="follow-number">{{
                      followees[list.name[0]] && followees[list.name[0]].length
                        ? followees[list.name[0]].length
                        : 0
                    }}</span>
                  </div>
                </div>
                <div>
                  <p>Currently Following</p>
                  <ul
                    v-if="
                      followees[list.name[0]] && followees[list.name[0]].length
                    "
                    class="followees-main"
                  >
                    <li
                      v-for="(followee, index) in followees[list.name[0]]"
                      :key="index"
                      class="followees-item"
                    >
                      <span
                        v-show="
                          SNSNeurons &&
                          ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'SNS1' &&
                            arrayToString(followee.id) === sns1Id) ||
                            (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'CHAT' &&
                              arrayToString(followee.id) === chatId))
                        "
                      >
                        ICLighthouse
                        <a-icon
                          type="copy"
                          @click.stop.prevent
                          v-clipboard:copy="arrayToString(followee.id)"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                        />
                      </span>
                      <copy-account
                        v-show="
                          !(
                            SNSNeurons &&
                            ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'SNS1' &&
                              arrayToString(followee.id) === sns1Id) ||
                              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                                'CHAT' &&
                                arrayToString(followee.id) === chatId))
                          )
                        "
                        :front="8"
                        :account="arrayToString(followee.id)"
                        copy-text="Neuron ID"
                      ></copy-account>
                      <span class="margin-left-auto">
                        <a-icon
                          @click="
                            deleteFollowee(list, arrayToString(followee.id))
                          "
                          type="close"
                        />
                      </span>
                    </li>
                  </ul>
                  <div class="add-followee-button mt20">
                    <button
                      type="button"
                      class="primary"
                      @click="onAddFollowee(list)"
                    >
                      Add Followee
                    </button>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-collapse-panel>-->
        </a-collapse>
      </div>
    </a-modal>
    <a-modal
      v-model="newFolloweeVisible"
      centered
      title="Enter New Followee"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model
        :model="newFolloweeForm"
        ref="newFolloweeForm"
        :rules="newFolloweeFormRules"
      >
        <a-form-model-item label="Followee's Neuron Id" prop="neuronId">
          <a-input
            v-model="newFolloweeForm.neuronId"
            autocomplete="off"
            type="text"
            placeholder="Neuron Id"
          />
          <div
            v-show="
              SNSNeurons &&
              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1' ||
                SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT' ||
                SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'ICL')
            "
            @click="setICLighthouseId"
            class="pointer ICLighthouse-id"
          >
            <button type="button">ICLighthouse</button>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="w100 mt20 transfer-submit large-primary primary"
            @click="followNeuron"
          >
            Follow Neuron
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SNSNeuronsInfo } from '@/views/home/ICSNS/model';
import {
  Followee,
  FolloweesForTopic,
  GovernanceError,
  SNSNeuron,
  SNSNeuronId,
  Topic,
  TopicInfo
} from '@/ic/SNSGovernance/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { hexToBytes, toHexString } from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import {
  ICLighthouseCHATNeuronId,
  ICLighthouseNeuronId,
  ICLNeuronId
} from '@/ic/utils';
@Component({
  name: 'Following',
  components: {},
  filters: {
    filterFolloweesNumber(
      topicInfo: TopicInfo,
      followees: { [key: string]: Array<SNSNeuronId> }
    ): number {
      if (topicInfo && topicInfo.topic && topicInfo.topic[0]) {
        const topic = Object.keys(topicInfo.topic[0])[0];
        if (followees[topic] && followees[topic].length) {
          return followees[topic].length;
        }
      }
      return 0;
    }
  }
})
export default class extends Vue {
  private visible = false;
  private newFolloweeVisible = false;
  private activeKey = null;
  private activeKeyAdvanced = null;
  private newFolloweeForm = {
    neuronId: ''
  };
  private functionId: bigint = null;
  private topicName: string = null;
  private newFolloweeFormRules = {
    neuronId: [
      { required: true, message: 'Please enter neuron id', trigger: 'change' }
    ]
  };
  private SNSNeurons: SNSNeuronsInfo = null;
  private neuron: SNSNeuron = null;
  private SNSIndex: number;
  private index: number;
  private followees: { [key: string]: Array<SNSNeuronId> } = {};
  private functionsName: { [key: string]: string } = {};
  private ICLId = ICLNeuronId;
  private sns1Id = ICLighthouseNeuronId;
  private chatId = ICLighthouseCHATNeuronId;
  private setICLighthouseId(): void {
    if (this.SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1') {
      this.newFolloweeForm.neuronId = ICLighthouseNeuronId;
    }
    if (this.SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT') {
      this.newFolloweeForm.neuronId = ICLighthouseCHATNeuronId;
    }
    if (this.SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'ICL') {
      this.newFolloweeForm.neuronId = ICLNeuronId;
    }
    (this.$refs.newFolloweeForm as any).validateField('neuronId');
  }
  private async init(
    SNSNeuronsList: Array<SNSNeuronsInfo>,
    SNSIndex: number,
    index: number
  ): Promise<void> {
    this.SNSIndex = SNSIndex;
    this.index = index;
    this.SNSNeurons = SNSNeuronsList[SNSIndex];
    this.neuron = this.SNSNeurons.SNSNeurons[index];
    this.visible = true;
    if (!this.SNSNeurons.listTopics) {
      await this.getListTopics();
    }
    this.followees = {};
    if (this.neuron.topic_followees && this.neuron.topic_followees[0]) {
      this.neuron.topic_followees[0].topic_id_to_followees.forEach((item) => {
        if (
          item[1] &&
          item[1].topic &&
          item[1].topic[0] &&
          item[1].followees &&
          item[1].followees.length
        ) {
          const name = Object.keys(item[1].topic[0])[0];
          if (!this.followees[name]) {
            this.followees[name] = [];
          }
          item[1].followees.forEach((followee) => {
            if (followee.neuron_id && followee.neuron_id[0]) {
              this.followees[name].push(followee.neuron_id[0]);
            }
          });
        }
      });
    }
    // this.$forceUpdate();
  }
  private async getListTopics(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const listTopics = await snsGovernanceService.list_topics(
        this.SNSNeurons.SNSNeuronOfGovernanceId
      );
      this.SNSNeurons.listTopics = listTopics;
      this.$emit('setListTopics', listTopics, this.SNSIndex);
    } catch (e) {}
    loading.close();
  }
  private onAddFollowee(topicInfo: TopicInfo): void {
    this.topicName = Object.keys(topicInfo.topic[0])[0];
    this.newFolloweeVisible = true;
  }
  private deleteFollowee(listTopics: TopicInfo, neuronId: string): void {
    if (listTopics.topic && listTopics.topic[0]) {
      const listTopic = Object.keys(listTopics.topic[0])[0];
      if (this.neuron.topic_followees && this.neuron.topic_followees[0]) {
        const followeesForTopic: Array<FolloweesForTopic> = [];
        this.neuron.topic_followees[0].topic_id_to_followees.forEach((item) => {
          if (item[1].topic && item[1].topic[0]) {
            const topic = Object.keys(item[1].topic[0])[0];
            if (topic === listTopic) {
              const topicFollowees = [];
              item[1].followees.forEach((followee) => {
                if (
                  followee.neuron_id &&
                  followee.neuron_id[0] &&
                  followee.neuron_id[0].id
                ) {
                  const id = this.arrayToString(followee.neuron_id[0].id);
                  if (id !== neuronId) {
                    topicFollowees.push(followee);
                  }
                }
              });
              followeesForTopic.push({
                topic: item[1].topic,
                followees: topicFollowees
              });
            } else {
              followeesForTopic.push(item[1]);
            }
          }
        });
        this.setFollowing(followeesForTopic, 'delete');
      }
    }
  }
  private async onAddAllFollowee(): Promise<void> {
    this.topicName = null;
    this.newFolloweeVisible = true;
  }
  private async deleteAllFollowee(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const followees = [];
      if (
        this.SNSNeurons.listTopics.topics[0] &&
        this.SNSNeurons.listTopics.topics[0]
      ) {
        this.SNSNeurons.listTopics.topics[0].forEach((item) => {
          followees.push({
            topic: item.topic,
            followees: []
          });
        });
      }
      await this.setFollowing(followees, 'delete');
      this.$emit('followNeuronSuccess', this.SNSIndex, this.index);
    } catch (e) {}
    loading.close();
  }
  private followNeuron(): void {
    (this.$refs.newFolloweeForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          if (
            this.newFolloweeForm.neuronId.trim() ===
            this.arrayToString(this.neuron.id[0].id)
          ) {
            this.$message.error("You can't add the same neuron as followee.");
            return;
          }
          if (!this.topicName) {
            const loading = this.$loading({
              lock: true,
              background: 'rgba(0, 0, 0, 0.5)'
            });
            await checkAuth();
            try {
              const snsGovernanceService = new SNSGovernanceService();
              const res = await snsGovernanceService.getNeuron(
                this.SNSNeurons.SNSNeuronOfGovernanceId,
                [
                  {
                    id: Array.from(
                      hexToBytes(this.newFolloweeForm.neuronId.trim())
                    )
                  }
                ]
              );
              if (res.result) {
                const type = Object.keys(res.result[0])[0];
                if (type === 'Neuron') {
                  let topicFollowees: Array<FolloweesForTopic> = [];
                  if (this.SNSNeurons.listTopics.topics[0]) {
                    this.SNSNeurons.listTopics.topics[0].forEach((item) => {
                      topicFollowees.unshift({
                        topic: item.topic,
                        followees: [
                          {
                            alias: [],
                            neuron_id: [
                              {
                                id: Array.from(
                                  hexToBytes(
                                    this.newFolloweeForm.neuronId.trim()
                                  )
                                )
                              }
                            ]
                          }
                        ]
                      });
                    });
                    this.setFollowing(topicFollowees);
                  }
                } else {
                  this.$message.error(
                    `Neuron with id ${this.newFolloweeForm.neuronId.trim()} does not exist.`
                  );
                }
              }
            } catch (e) {
              loading.close();
            }
          } else {
            let followees: Array<SNSNeuronId> = [];
            if (
              this.followees[this.topicName] &&
              this.followees[this.topicName].length
            ) {
              followees = JSON.parse(
                JSON.stringify(this.followees[this.topicName])
              );
            }
            const flag = followees.some((followee) => {
              return (
                this.newFolloweeForm.neuronId.trim() ===
                this.arrayToString(followee.id)
              );
            });
            if (flag) {
              this.$message.error('You are already following this neuron.');
              return;
            }
            const loading = this.$loading({
              lock: true,
              background: 'rgba(0, 0, 0, 0.5)'
            });
            await checkAuth();
            try {
              const snsGovernanceService = new SNSGovernanceService();
              const res = await snsGovernanceService.getNeuron(
                this.SNSNeurons.SNSNeuronOfGovernanceId,
                [
                  {
                    id: Array.from(
                      hexToBytes(this.newFolloweeForm.neuronId.trim())
                    )
                  }
                ]
              );
              loading.close();
              if (res.result) {
                const type = Object.keys(res.result[0])[0];
                if (type === 'Neuron') {
                  let topicFollowees: Array<FolloweesForTopic> = [];
                  const followee: Followee = {
                    alias: [],
                    neuron_id: [
                      {
                        id: Array.from(
                          hexToBytes(this.newFolloweeForm.neuronId.trim())
                        )
                      }
                    ]
                  };
                  if (
                    this.neuron.topic_followees[0] &&
                    this.neuron.topic_followees[0].topic_id_to_followees &&
                    this.neuron.topic_followees[0].topic_id_to_followees.length
                  ) {
                    let flag = false;
                    this.neuron.topic_followees[0].topic_id_to_followees.forEach(
                      (item) => {
                        if (
                          item.length &&
                          item[1] &&
                          item[1].topic &&
                          item[1].topic[0]
                        ) {
                          const topic = Object.keys(item[1].topic[0])[0];
                          if (topic === this.topicName) {
                            flag = true;
                            if (item[1].followees.length) {
                              const newFollowee = JSON.parse(
                                JSON.stringify(item[1].followees)
                              );
                              newFollowee.unshift(followee);
                              topicFollowees.push({
                                topic: item[1].topic,
                                followees: newFollowee
                              });
                            } else {
                              topicFollowees.push({
                                topic: item[1].topic,
                                followees: [followee]
                              });
                            }
                          }
                        }
                      }
                    );
                    if (!flag) {
                      const topic = { [this.topicName]: null } as Topic;
                      topicFollowees.push({
                        topic: [topic],
                        followees: [followee]
                      });
                    }
                  } else {
                    const topic = { [this.topicName]: null } as Topic;
                    topicFollowees = [
                      {
                        topic: [topic],
                        followees: [followee]
                      }
                    ];
                  }
                  this.setFollowing(topicFollowees);
                } else {
                  this.$message.error(
                    `Neuron with id ${this.newFolloweeForm.neuronId.trim()} does not exist.`
                  );
                }
              }
            } catch (e) {
              loading.close();
            }
          }
        }
      }
    );
  }
  private async setFollowing(
    followees: Array<FolloweesForTopic>,
    followeesType?: string
  ): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const res = await snsGovernanceService.setFollowing(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        followees
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          if (followeesType) {
            this.$message.success('Success');
          } else {
            this.$message.success('Success');
            this.newFolloweeVisible = false;
          }
          this.$emit('followNeuronSuccess', this.SNSIndex, this.index);
        }
      } else {
        if (followeesType) {
          this.$message.error('Error');
        } else {
          this.$message.error('Follow Neuron Error');
        }
      }
    } catch (e) {}
    loading.close();
  }
  private async setFollowees(
    followees: Array<SNSNeuronId>,
    followeesType?: string
  ): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const res = await snsGovernanceService.setFollowees(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        this.functionId,
        followees
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          if (followeesType) {
            this.$message.success('Success');
          } else {
            this.$message.success('Success');
            this.newFolloweeVisible = false;
          }
          this.$emit('followNeuronSuccess', this.SNSIndex, this.index);
        }
      } else {
        if (followeesType) {
          this.$message.error('Error');
        } else {
          this.$message.error('Follow Neuron Error');
        }
      }
    } catch (e) {}
    loading.close();
  }
  private afterClose(): void {
    this.functionId = null;
    (this.$refs.newFolloweeForm as any).resetFields();
  }
  private afterCloseFollow(): void {
    this.activeKey = null;
    this.activeKeyAdvanced = null;
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private onError(): void {
    //
  }
}
</script>
<style scoped lang="scss">
.add-remove-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #fff;
  button {
    width: 100px;
  }
}
.follow-Neuron-list {
  padding: 20px 0;
  .follow-Neuron-list-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: #fff;
  }
  .follow-Neuron-list-item {
    padding: 10px 0;
    border-top: 1px solid #212b35;
    &:last-child {
      border-bottom: 1px solid #212b35;
    }
    .follow-Neuron-list-item-name {
      color: #fff;
    }
    .follow-Neuron-list-item-ids {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .follow-Neuron-list-item-id {
      display: inline-block;
      margin: 5px 5px 0 0;
      padding: 2px 8px;
      border: 1px solid #212b35;
      border-radius: 30px;
      color: #adb3c4;
    }
  }
}
.follow-Neuron-button {
  padding-bottom: 20px;
}
.system-name {
  font-size: 18px;
  color: #fff;
}
.system-description {
  color: #777d90;
  padding-right: 15px;
}
.follow-collapse-panel-header {
  display: flex;
  align-items: center;
}
.follow-number {
  margin-left: auto;
  font-size: 16px;
  color: #fff;
}
.follow-collapse-panel-main {
  background: #212b35;
  border: none;
  .follow-collapse-panel-item {
    border-color: #212b35;
  }
  ::v-deep .ant-collapse-arrow {
    color: #fff !important;
  }
  ::v-deep .ant-collapse-content {
    background: #212b35;
    border: none;
    color: #adb3c4;
  }
  .add-followee-button {
    button {
      height: 40px;
      margin: 0 auto;
    }
  }
  .followees-main {
    margin-top: 10px;
  }
  .followees-item {
    display: flex;
    align-items: center;
  }
}
.follow-neurons-modal {
  ::v-deep .ant-modal-content {
    min-height: 400px;
  }
  ::v-deep .ant-collapse > .ant-collapse-item {
    border: 0;
  }
}
.ICLighthouse-id {
  padding: 5px 0;
  font-size: 16px;
  button {
    background: #1a2a33;
    color: #52b7c3;
  }
}
</style>
