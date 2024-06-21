import { getPreferenceValues } from "@raycast/api";
import { Liveblocks } from "@liveblocks/node";

interface Preferences {
  secret: string;
}

const createClient = async () => {
  const preferences = getPreferenceValues<Preferences>();

  if (!preferences.secret) {
    throw new Error("Secret key is required");
  }

  return new Liveblocks({
    secret: preferences.secret,
  });
};

export const getRooms = async () => {
  const liveblocks = await createClient();

  return liveblocks.getRooms();
};

export const getRoom = async (roomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.getRoom(roomId);
};

// TODO: sort params
export const createRoom = async (roomId: string, params: any) => {
  const liveblocks = await createClient();

  return liveblocks.createRoom(roomId, params);
};

// TODO: sort params
export const updateRoom = async (roomId: string, params: any) => {
  const liveblocks = await createClient();

  return liveblocks.updateRoom(roomId, params);
};

export const deleteRoom = async (roomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.deleteRoom(roomId);
};

export const updateRoomId = async (currentRoomId: string, newRoomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.updateRoomId({
    currentRoomId,
    newRoomId,
  });
};

export const initRoomStorage = async (roomId: string, type: string, payload: string) => {
  const liveblocks = await createClient();

  return liveblocks.initializeStorageDocument(roomId, {
    liveblocksType: type, // TODO: fix this
    data: JSON.parse(payload),
  });
};

export const getActiveUsers = async (roomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.getActiveUsers(roomId);
};

// TODO: sort data
export const broadcastEvent = async (roomId: string, data: any) => {
  const liveblocks = await createClient();

  return liveblocks.broadcastEvent(roomId, data);
};

export const getRoomStorage = async (roomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.getStorageDocument(roomId);
};

export const deleteRoomStorage = async (roomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.deleteStorageDocument(roomId);
};

export const getYjsDocument = async (roomId: string) => {
  const liveblocks = await createClient();

  return liveblocks.getYjsDocument(roomId);
};

// export const sendYjsBinaryUpdate = async (roomId: string, update: Uint8Array) => {
//   const liveblocks = await createClient();

//   return liveblocks.sendYjsBinaryUpdate("my-room-id", update);
// };

// export const getYjsDocumentAsBinaryUpdate = async (roomId: string) => {
//   const liveblocks = await createClient();

//   return liveblocks.getYjsDocumentAsBinaryUpdate(roomId);
// };
