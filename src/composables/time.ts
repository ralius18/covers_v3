export function secondsToMinutes(value: number): string {
    if ([NaN, null, undefined, ""].includes(value)) {
      return '';
    }

    const mins = Math.floor(value / 60);
    const secs = value - mins * 60;

    function str_pad_left(num: number, pad: string, length: number) {
      return (new Array(length + 1).join(pad) + num).slice(-length);
    }

    return mins + ':' + str_pad_left(secs, '0', 2);
}

export function minutesToSeconds(value: string): number | null {
  if ([NaN, null, undefined, ""].includes(value)) {
    return null
  }
  const timeArr = value.split(":")
  return parseInt(timeArr[0]) * 60 + parseInt(timeArr[1])
}

export function epochToDate(value: number): Date {
  return new Date(value)
}