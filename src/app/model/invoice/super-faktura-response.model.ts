export interface SuperFakturaResponse {
  error: number;
  message: string;
  flash_message: FlashMessage;
}

export interface FlashMessage {
  text: string;
  type: string;
}
