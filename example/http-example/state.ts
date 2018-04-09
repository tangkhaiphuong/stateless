export const enum State {
    Begin = 'BEGIN',
    NeedConnection = 'NEED CONNECTION',
    NeedRequest = 'NEED REQUEST ',
    SendRequest = 'SEND REQUEST',
    NeedAccessAuth = 'NEED ACCESS AUTH',
    NeedBody = 'NEED BODY',
    Error = 'ERROR',
    Redirection = 'REDIRECTION',
    NoData = 'NO DATA',
    GotData = 'GOT DATA'
}
