import {
  HttpAgent,
  Cbor,
  LookupResult,
  LookupStatus,
  Cert
} from '@dfinity/agent';
import { PrincipalString } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';

export const gib_storage_per_second_fee = 127000; // For 13-node subnet;For 34-node subnet: 127000 / 13 * 34 cycles
export const gib_storage_per_second_fee_34 = 127000 / 13 * 34;
const encoder = new TextEncoder();
const encode = (arg: string): ArrayBuffer => {
  return new DataView(encoder.encode(arg).buffer).buffer;
};

export const readStateSubnet = async (
  canisterId: PrincipalString
): Promise<SubnetStatus> => {
  const agent = new HttpAgent({ host: 'https://ic0.app' });
  const path = [encode('subnet')];
  const response = await agent.readState(canisterId, {
    paths: [path]
  });
  return fetchNodeKeys(
    response.certificate,
    Principal.fromText(canisterId),
    agent.rootKey
  );
};
export const fetchNodeKeys = (
  certificate: ArrayBuffer,
  canisterId: Principal,
  root_key?: ArrayBuffer | Uint8Array
): SubnetStatus => {
  if (!canisterId._isPrincipal) {
    throw new Error('Invalid canisterId');
  }
  const cert = Cbor.decode(new Uint8Array(certificate)) as Cert;
  const tree = cert.tree;
  let delegation = cert.delegation;
  let subnetId: Principal;
  if (delegation && delegation.subnet_id) {
    subnetId = Principal.fromUint8Array(new Uint8Array(delegation.subnet_id));
  } else if (!delegation && typeof root_key !== 'undefined') {
    // On local replica, with System type subnet, there is no delegation
    subnetId = Principal.selfAuthenticating(new Uint8Array(root_key));
    delegation = {
      subnet_id: subnetId.toUint8Array(),
      certificate: new ArrayBuffer(0)
    };
  } else {
    // otherwise use default NNS subnet id
    subnetId = Principal.selfAuthenticating(
      Principal.fromText(
        'tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe'
      ).toUint8Array()
    );
    delegation = {
      subnet_id: subnetId.toUint8Array(),
      certificate: new ArrayBuffer(0)
    };
  }
  const subnetLookupResult = lookup_path(
    ['subnet', delegation.subnet_id, 'node'],
    tree
  );
  if (subnetLookupResult.status !== LookupStatus.Found) {
    throw new Error('Node not found');
  }
  if (subnetLookupResult.value instanceof ArrayBuffer) {
    throw new Error('Invalid node tree');
  }
  const nodeForks = flatten_forks(subnetLookupResult.value);
  const nodeKeys = new Map<string, DerEncodedPublicKey>();

  nodeForks.forEach((fork) => {
    const node_id = Principal.from(
      new Uint8Array(fork[1] as ArrayBuffer)
    ).toText();
    const publicKeyLookupResult = lookup_path(
      ['public_key'],
      fork[2] as HashTree
    );
    if (publicKeyLookupResult.status !== LookupStatus.Found) {
      throw new Error('Public key not found');
    }

    const derEncodedPublicKey = publicKeyLookupResult.value as ArrayBuffer;
    if (derEncodedPublicKey.byteLength !== 44) {
      throw new Error('Invalid public key length');
    } else {
      nodeKeys.set(node_id, derEncodedPublicKey as DerEncodedPublicKey);
    }
  });

  return {
    subnetId: Principal.fromUint8Array(
      new Uint8Array(delegation.subnet_id)
    ).toText(),
    nodeKeys
  };
};
/**
 * If the tree is a fork, flatten it into an array of trees
 * @param t - the tree to flatten
 * @returns HashTree[] - the flattened tree
 */
export function flatten_forks(t: HashTree): HashTree[] {
  switch (t[0]) {
    case NodeType.Empty:
      return [];
    case NodeType.Fork:
      return flatten_forks(t[1] as HashTree).concat(
        flatten_forks(t[2] as HashTree)
      );
    default:
      return [t];
  }
}
export function lookup_path(
  path: Array<ArrayBuffer | string>,
  tree: HashTree
): LookupResult {
  if (path.length === 0) {
    switch (tree[0]) {
      case NodeType.Leaf: {
        if (!tree[1]) {
          throw new Error('Invalid tree structure for leaf');
        }

        if (tree[1] instanceof ArrayBuffer) {
          return {
            status: LookupStatus.Found,
            value: tree[1]
          };
        }

        if (tree[1] instanceof Uint8Array) {
          return {
            status: LookupStatus.Found,
            value: tree[1].buffer
          };
        }

        return {
          status: LookupStatus.Found,
          value: tree[1]
        };
      }

      default: {
        return {
          status: LookupStatus.Found,
          value: tree
        };
      }
    }
  }

  const label =
    typeof path[0] === 'string' ? new TextEncoder().encode(path[0]) : path[0];
  const lookupResult = find_label(label, tree);

  switch (lookupResult.status) {
    case LookupStatus.Found: {
      return lookup_path(path.slice(1), lookupResult.value as HashTree);
    }

    case LabelLookupStatus.Greater:
    case LabelLookupStatus.Less: {
      return {
        status: LookupStatus.Absent
      };
    }

    default: {
      return lookupResult;
    }
  }
}
export function find_label(
  label: ArrayBuffer,
  tree: HashTree
): LabelLookupResult {
  switch (tree[0]) {
    // if we have a labelled node, compare the node's label to the one we are
    // looking for
    case NodeType.Labeled:
      // if the label we're searching for is greater than this node's label,
      // we need to keep searching
      if (isBufferGreaterThan(label, tree[1])) {
        return {
          status: LabelLookupStatus.Greater
        };
      }

      // if the label we're searching for is equal this node's label, we can
      // stop searching and return the found node
      if (bufEquals(label, tree[1])) {
        return {
          status: LookupStatus.Found,
          value: tree[2]
        };
      }

      // if the label we're searching for is not greater than or equal to this
      // node's label, then it's less than this node's label, and we can stop
      // searching because we've looked too far
      return {
        status: LabelLookupStatus.Less
      };

    // if we have a fork node, we need to search both sides, starting with the left
    case NodeType.Fork:
      // search in the left node
      const leftLookupResult = find_label(label, tree[1]);

      switch (leftLookupResult.status) {
        // if the label we're searching for is greater than the left node lookup,
        // we need to search the right node
        case LabelLookupStatus.Greater: {
          const rightLookupResult = find_label(label, tree[2]);

          // if the label we're searching for is less than the right node lookup,
          // then we can stop searching and say that the label is provably Absent
          if (rightLookupResult.status === LabelLookupStatus.Less) {
            return {
              status: LookupStatus.Absent
            };
          }

          // if the label we're searching for is less than or equal to the right
          // node lookup, then we let the caller handle it
          return rightLookupResult;
        }

        // if the left node returns an uncertain result, we need to search the
        // right node
        case LookupStatus.Unknown: {
          let rightLookupResult = find_label(label, tree[2]);

          // if the label we're searching for is less than the right node lookup,
          // then we also need to return an uncertain result
          if (rightLookupResult.status === LabelLookupStatus.Less) {
            return {
              status: LookupStatus.Unknown
            };
          }

          // if the label we're searching for is less than or equal to the right
          // node lookup, then we let the caller handle it
          return rightLookupResult;
        }

        // if the label we're searching for is not greater than the left node
        // lookup, or the result is not uncertain, we stop searching and return
        // whatever the result of the left node lookup was, which can be either
        // Found or Absent
        default: {
          return leftLookupResult;
        }
      }

    // if we encounter a Pruned node, we can't know for certain if the label
    // we're searching for is present or not
    case NodeType.Pruned:
      return {
        status: LookupStatus.Unknown
      };

    // if the current node is Empty, or a Leaf, we can stop searching because
    // we know for sure that the label we're searching for is not present
    default:
      return {
        status: LookupStatus.Absent
      };
  }
}
/**
 *
 * @param b1 array buffer 1
 * @param b2 array buffer 2
 * @returns number - negative if b1 < b2, positive if b1 > b2, 0 if b1 === b2
 */
export function compare(b1: ArrayBuffer, b2: ArrayBuffer): number {
  if (b1.byteLength !== b2.byteLength) {
    return b1.byteLength - b2.byteLength;
  }

  const u1 = new Uint8Array(b1);
  const u2 = new Uint8Array(b2);
  for (let i = 0; i < u1.length; i++) {
    if (u1[i] !== u2[i]) {
      return u1[i] - u2[i];
    }
  }
  return 0;
}

/**
 * Checks two array buffers for equality.
 * @param b1 array buffer 1
 * @param b2 array buffer 2
 * @returns boolean
 */
export function bufEquals(b1: ArrayBuffer, b2: ArrayBuffer): boolean {
  return compare(b1, b2) === 0;
}

function isBufferGreaterThan(a: ArrayBuffer, b: ArrayBuffer): boolean {
  const a8 = new Uint8Array(a);
  const b8 = new Uint8Array(b);
  for (let i = 0; i < a8.length; i++) {
    if (a8[i] > b8[i]) {
      return true;
    }
  }
  return false;
}
export type SubnetStatus = {
  // Principal as a string
  subnetId: string;
  nodeKeys: Map<string, DerEncodedPublicKey>;
  metrics?: {
    num_canisters: bigint;
    canister_state_bytes: bigint;
    consumed_cycles_total: {
      current: bigint;
      deleted: bigint;
    };
    update_transactions_total: bigint;
  };
};
export type DerEncodedPublicKey = ArrayBuffer & {
  __derEncodedPublicKey__?: void;
};
export enum NodeType {
  Empty = 0,
  Fork = 1,
  Labeled = 2,
  Leaf = 3,
  Pruned = 4
}

export type NodeLabel = ArrayBuffer | Uint8Array;

export type HashTree =
  | [NodeType.Empty]
  | [NodeType.Fork, HashTree, HashTree]
  | [NodeType.Labeled, NodeLabel, HashTree]
  | [NodeType.Leaf, NodeLabel]
  | [NodeType.Pruned, NodeLabel];

enum LabelLookupStatus {
  Less = 'less',
  Greater = 'greater'
}

interface LookupResultGreater {
  status: LabelLookupStatus.Greater;
}

interface LookupResultLess {
  status: LabelLookupStatus.Less;
}

type LabelLookupResult = LookupResult | LookupResultGreater | LookupResultLess;
