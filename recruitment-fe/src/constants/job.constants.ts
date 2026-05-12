export const LOCATIONS = [
  "Tất cả địa điểm",
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Bình Dương",
  "Đồng Nai",
  "Bắc Ninh",
  "Long An",
  "Khác"
];

export const JOB_TYPES = [
  { label: "Toàn thời gian", value: "FULL_TIME" },
  { label: "Bán thời gian", value: "PART_TIME" },
  { label: "Thực tập", value: "INTERNSHIP" },
  { label: "Remote (Làm từ xa)", value: "REMOTE" },
];

export const SALARY_RANGES = [
  { label: "Tất cả mức lương", min: null, max: null },
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { label: "20 - 50 triệu", min: 20000000, max: 50000000 },
  { label: "Trên 50 triệu", min: 50000000, max: 999999999 },
  { label: "Thỏa thuận", min: null, max: null, isNegotiable: true },
];
