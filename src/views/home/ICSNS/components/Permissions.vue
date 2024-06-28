<template>
  <div>
    <a-modal
      v-model="visible"
      centered
      title="Neuron Permissions"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <div class="base-font-tip">
        The different types of neuron permissions, i.e., privileges to modify a
        neuron, that principals can have.
      </div>
      <div class="permission-Neuron-list">
        <p class="permission-Neuron-list-title">Currently Permissions</p>
        <div v-if="neuron && neuron.permissions && neuron.permissions.length">
          <ul
            class="permission-Neuron-list-item"
            v-for="(item, permissionsIndex) in neuron.permissions"
            :key="permissionsIndex.toString(10)"
          >
            <li>
              <div class="permission-Neuron-list-item-name">
                {{ item.principal[0].toString() }}
              </div>
              <div class="permission-Neuron-list-item-ids">
                <div
                  v-for="(permissionType, index) in item.permission_type"
                  :key="index"
                >
                  <span class="permission-Neuron-list-item-id">
                    {{ neuronPermissionEnum[Number(permissionType)] }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>No permissions</div>
      </div>
      <div class="add-remove-title">
        Add/Remove hotkeys
        <div class="margin-left-auto add-remove-title-button">
          <button type="button" class="primary" @click="onAddAll">
            Add all
          </button>
          <button
            type="button"
            class="primary"
            @click="onRemoveAll"
            style="margin-left: 10px"
          >
            Remove all
          </button>
        </div>
      </div>
      <a-collapse
        expand-icon-position="right"
        class="permission-collapse-panel-main"
        v-model="activeKey"
      >
        <a-collapse-panel
          v-for="(item, index) in neuronSystemPermissions"
          :key="index.toString(10)"
          class="permission-collapse-panel-item"
        >
          <div slot="header">
            <div class="permission-collapse-panel-header">
              <div>
                <p class="system-name">{{ item.name }}</p>
                <div class="system-description">
                  {{ item.description }}
                </div>
              </div>
              <span class="permission-number">
                {{
                  permissions[item.id.toString(10)] &&
                  permissions[item.id.toString(10)].length
                    ? permissions[item.id.toString(10)].length
                    : 0
                }}
              </span>
            </div>
          </div>
          <div>
            <p>Currently Permissions</p>
            <ul>
              <li
                v-for="(principalId, index) in permissions[
                  item.id.toString(10)
                ]"
                :key="index"
                class="permission-item"
              >
                <copy-account
                  :front="8"
                  :account="principalId"
                  copy-text=""
                ></copy-account>
                <span class="margin-left-auto">
                  <a-icon
                    @click="removeNeuronPermissions(principalId, item.id)"
                    v-if="getPrincipalId !== principalId"
                    type="close"
                  />
                </span>
              </li>
            </ul>
          </div>
          <div class="add-permission-button mt20">
            <button
              type="button"
              class="primary"
              @click="onAddPermission(item)"
            >
              Add Permissions
            </button>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-modal>
    <a-modal
      v-model="addPermissionVisible"
      centered
      title="Add Neuron Permissions"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterAddClose"
    >
      <a-form-model
        :model="addPermissionForm"
        ref="addPermissionForm"
        :rules="addPermissionFormRules"
      >
        <a-form-model-item label="Principal Id" prop="principalId">
          <a-input
            v-model="addPermissionForm.principalId"
            autocomplete="off"
            type="text"
            placeholder="Principal Id"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="w100 mt20 transfer-submit large-primary primary"
            @click="addPermission"
          >
            Add Permissions
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  NeuronPermissionEnum,
  neuronSystemPermissionsType,
  SNSNeuronsInfo
} from '@/views/home/ICSNS/model';
import {
  GovernanceError,
  NeuronPermission,
  SNSNeuron
} from '@/ic/SNSGovernance/model';
import { validateCanister } from '@/utils/validate';
import { checkAuth } from '@/ic/CheckAuth';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { Principal } from '@dfinity/principal';
import { namespace } from 'vuex-class';

const commonModule = namespace('common');

@Component({
  name: 'Permissions',
  components: {}
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private visible = false;
  private activeKey = null;
  private SNSNeurons: SNSNeuronsInfo = null;
  private neuron: SNSNeuron = null;
  private SNSIndex: number;
  private index: number;
  private permissionId = null;
  private addPermissionVisible = false;
  private type = '';
  private addPermissionForm = {
    principalId: ''
  };
  private addPermissionFormRules = {
    principalId: [
      {
        required: true,
        message: 'Please enter principal id',
        trigger: 'change'
      },
      { validator: validateCanister, trigger: 'change' }
    ]
  };
  private neuronPermissionEnum = NeuronPermissionEnum;
  private neuronSystemPermissions: Array<neuronSystemPermissionsType> = [];
  private permissions: { [key: string]: Array<string> } = {};
  private init(
    SNSNeuronsList: Array<SNSNeuronsInfo>,
    SNSIndex: number,
    index: number
  ): void {
    this.SNSIndex = SNSIndex;
    this.index = index;
    this.SNSNeurons = SNSNeuronsList[SNSIndex];
    this.neuron = this.SNSNeurons.SNSNeurons[index];
    this.visible = true;
    console.log(this.neuron);
    console.log(this.SNSNeurons);
    this.getPermissions();
  }
  private getPermissions(): void {
    this.permissions = {};
    this.neuron.permissions.forEach((permissions) => {
      permissions.permission_type = permissions.permission_type.sort(
        (a, b) => Number(a) - Number(b)
      );
      permissions.permission_type.forEach((type) => {
        if (!this.permissions[type.toString(10)]) {
          this.permissions[type.toString(10)] = [];
        }
        if (
          !this.permissions[type.toString(10)].includes(
            permissions.principal[0].toString()
          )
        ) {
          this.permissions[type.toString(10)].push(
            permissions.principal[0].toString()
          );
        }
      });
    });
    console.log(this.permissions);
    const neuron_grantable_permissions = [];
    this.neuronSystemPermissions = [];
    this.SNSNeurons.nervousSystemParameters.neuron_grantable_permissions[0].permissions.forEach(
      (item) => {
        neuron_grantable_permissions.push(Number(item));
      }
    );
    console.log(neuron_grantable_permissions);
    const neuronSystemPermissions: Array<neuronSystemPermissionsType> = [
      {
        id: 0,
        name: 'Unspecified',
        description: 'Unused, here for PB lint purposes.'
      },
      {
        id: 1,
        name: 'ConfigureDissolveState',
        description:
          "The principal has permission to configure the neuron's dissolve state. This includes start dissolving, stop dissolving, and increasing the dissolve delay for the neuron."
      },
      {
        id: 2,
        name: 'ManagePrincipals',
        description:
          'The principal has permission to add additional principals to modify the neuron.'
      },
      {
        id: 3,
        name: 'SubmitProposal',
        description:
          "The principal has permission to submit proposals on behalf of the neuron. Submitting proposals can change a neuron's stake and thus this is potentially a balance changing operation"
      },
      {
        id: 4,
        name: 'Vote',
        description:
          'The principal has permission to vote and follow other neurons on behalf of the neuron.'
      },
      {
        id: 5,
        name: 'Disburse',
        description: 'The principal has permission to disburse the neuron.'
      },
      {
        id: 6,
        name: 'Split',
        description: 'The principal has permission to split the neuron.'
      },
      {
        id: 7,
        name: 'MergeMaturity',
        description:
          "The principal has permission to merge the neuron's maturity into the neuron's stake."
      },
      {
        id: 8,
        name: 'DisburseMaturity',
        description:
          "The principal has permission to disburse the neuron's maturity to a given ledger account."
      },
      {
        id: 9,
        name: 'StakeMaturity',
        description:
          "The principal has permission to stake the neuron's maturity."
      },
      {
        id: 10,
        name: 'ManageVotingPermission',
        description:
          'the principal has permission to grant/revoke permission to vote and submit proposals on behalf of the neuron to other principals.'
      }
    ];
    neuronSystemPermissions.forEach((item) => {
      if (neuron_grantable_permissions.includes(item.id)) {
        this.neuronSystemPermissions.push(item);
      }
    });
  }
  private onAddAll(): void {
    this.type = 'all';
    this.addPermissionVisible = true;
  }
  private async onRemoveAll(): Promise<void> {
    const promiseValue = [];
    this.neuron.permissions.forEach((permission: NeuronPermission) => {
      if (
        permission.principal &&
        permission.principal[0].toString() !== this.getPrincipalId
      ) {
        promiseValue.push(
          this.removePermissions(
            permission.principal[0],
            permission.permission_type
          )
        );
      } else {
        // ManagePrincipals = 2
        const permission_type = permission.permission_type.filter(
          (item) => item.toString() !== '2'
        );
        promiseValue.push(
          this.removePermissions(permission.principal[0], permission_type)
        );
      }
    });
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      await Promise.all(promiseValue);
      this.$message.success('Remove Neuron Permission Success');
      this.$emit('permissionsNeuronSuccess', this.SNSIndex, this.index);
    } catch (e) {
      this.$message.error('Remove Neuron Permissions Error');
    }
    loading.close();
  }

  /**
   * removeAllPermissionsForPrincipal
   * @param principal
   * @param permissionIds
   */
  private async removePermissions(
    principal: Principal,
    permissionIds: Array<bigint>
  ): Promise<void> {
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.removeNeuronPermissions(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        principal,
        permissionIds
      );
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }
  private onAddPermission(item: neuronSystemPermissionsType): void {
    this.type = '';
    this.permissionId = item.id;
    this.addPermissionVisible = true;
  }
  private async removeNeuronPermissions(
    principalId: string,
    permissionId: number
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.removeNeuronPermissions(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        Principal.from(principalId),
        [BigInt(permissionId)]
      );
      console.log(res);
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          this.$message.success('Remove Neuron Permission Success');
          this.$emit('permissionsNeuronSuccess', this.SNSIndex, this.index);
        }
      }
    } catch (e) {
      console.error(e);
      this.$message.error('Remove Neuron Permission Error');
    }
    loading.close();
  }
  private addPermission(): void {
    (this.$refs.addPermissionForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          if (!this.type) {
            let permissions: Array<string> = [];
            if (
              this.permissions[this.permissionId.toString(10)] &&
              this.permissions[this.permissionId.toString(10)].length
            ) {
              permissions = JSON.parse(
                JSON.stringify(this.permissions[this.permissionId.toString(10)])
              );
            }
            const flag = permissions.some((permission) => {
              return this.addPermissionForm.principalId.trim() === permission;
            });
            if (flag) {
              this.$message.error(
                'You are already add this neuron permissions.'
              );
              return;
            }
            const loading = this.$loading({
              lock: true,
              background: 'rgba(0, 0, 0, 0.5)'
            });
            await checkAuth();
            try {
              const snsGovernanceService = new SNSGovernanceService();
              const res = await snsGovernanceService.addNeuronPermissions(
                this.SNSNeurons.SNSNeuronOfGovernanceId,
                this.neuron.id[0].id,
                Principal.from(this.addPermissionForm.principalId.trim()),
                [BigInt(this.permissionId)]
              );
              console.log(res);
              if (res && res.command) {
                const type = Object.keys(res.command[0])[0];
                if (type === 'Error') {
                  const err = Object.values(
                    res.command[0]
                  )[0] as GovernanceError;
                  this.$message.error(err.error_message);
                } else {
                  this.$message.success('Add Neuron Permission Success');
                  this.addPermissionVisible = false;
                  this.$emit(
                    'permissionsNeuronSuccess',
                    this.SNSIndex,
                    this.index
                  );
                }
              }
            } catch (e) {
              console.error(e);
              this.$message.error('Add Neuron Permission Error');
            }
            loading.close();
          } else {
            const promiseValue = [];
            this.SNSNeurons.nervousSystemParameters.neuron_grantable_permissions[0].permissions.forEach(
              (item) => {
                if (
                  (this.permissions[item.toString(10)] &&
                    this.permissions[item.toString(10)].indexOf(
                      this.addPermissionForm.principalId.trim()
                    ) === -1) ||
                  !this.permissions[item.toString(10)]
                ) {
                  promiseValue.push(this.toAddPermission(item.toString(10)));
                }
              }
            );
            const loading = this.$loading({
              lock: true,
              background: 'rgba(0, 0, 0, 0.5)'
            });
            await checkAuth();
            try {
              await Promise.all(promiseValue);
              this.$message.success('Add Neuron Permissions Success');
              this.addPermissionVisible = false;
              this.$emit('permissionsNeuronSuccess', this.SNSIndex, this.index);
            } catch (e) {
              console.error(e);
              this.$message.error('Add Neuron Permissions Error');
            }
            loading.close();
          }
        }
      }
    );
  }
  private async toAddPermission(permissionId: string): Promise<void> {
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const res = await snsGovernanceService.addNeuronPermissions(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        Principal.from(this.addPermissionForm.principalId.trim()),
        [BigInt(permissionId)]
      );
      console.log(res);
      // if (res && res.command) {
      //   const type = Object.keys(res.command[0])[0];
      //   if (type === 'Error') {
      //     const err = Object.values(res.command[0])[0] as GovernanceError;
      //     this.$message.error(err.error_message);
      //   } else {
      //     this.$message.success('Add Neuron Permission Success');
      //     this.addPermissionVisible = false;
      //     this.$emit('permissionsNeuronSuccess', this.SNSIndex, this.index);
      //   }
      // }
    } catch (e) {
      console.error(e);
    }
  }
  private afterClose(): void {
    this.activeKey = null;
  }
  private afterAddClose(): void {
    this.permissionId = null;
    (this.$refs.addPermissionForm as any).resetFields();
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
  .add-remove-title-button {
    display: flex;
  }
  button {
    width: auto;
    min-width: 100px;
  }
}
.permission-Neuron-list {
  padding: 20px 0;
  .permission-Neuron-list-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: #fff;
  }
  .permission-Neuron-list-item {
    padding: 10px 0;
    border-top: 1px solid #212b35;
    &:last-child {
      border-bottom: 1px solid #212b35;
    }
    .permission-Neuron-list-item-name {
      color: #fff;
    }
    .permission-Neuron-list-item-ids {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .permission-Neuron-list-item-id {
      display: inline-block;
      margin: 5px 5px 0 0;
      padding: 2px 8px;
      border: 1px solid #212b35;
      border-radius: 30px;
      color: #adb3c4;
    }
  }
}
.permission-Neuron-button {
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
.permission-collapse-panel-header {
  display: flex;
  align-items: center;
}
.permission-number {
  margin-left: auto;
  font-size: 16px;
  color: #fff;
}
.permission-collapse-panel-main {
  background: #212b35;
  border: none;
  .permission-collapse-panel-item {
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
  .add-permission-button {
    button {
      height: 40px;
      margin: 0 auto;
    }
  }
  .permission-main {
    margin-top: 10px;
  }
  .permission-item {
    display: flex;
    align-items: center;
  }
}
@media screen and (max-width: 768px) {
  .add-remove-title {
    flex-direction: column;
    align-items: flex-start;
    .add-remove-title-button {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}
</style>
