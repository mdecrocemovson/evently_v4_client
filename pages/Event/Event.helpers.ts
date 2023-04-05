export const updateAttendance = async ({
  eventId,
  userId,
  setUserAttendance,
  attendance,
  updateUserAttendance,
}) => {
  setUserAttendance(attendance);
  updateUserAttendance({
    variables: {
      input: {
        userId: userId,
        eventId: eventId,
        attendance: attendance,
      },
    },
  });
};
