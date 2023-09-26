import { LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Row, Spin, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";

export default function SendMail() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (text) => {
    const lines = text?.mails.split("\n");
    const currentDate = new Date();

    const newYorkTimeZone = "Europe/Berlin";
    const newYorkTimeOptions = { timeZone: newYorkTimeZone };

    // Format giờ hiện tại của New York
    const formattedTime = currentDate.toLocaleString(
      "en-US",
      newYorkTimeOptions
    );
    setLoading(true);
    for (const item of lines) {
      try {
        if (item) {
          if (item.includes("mailto:")) {
            const [key, value] = item.split(":");
            await axios.get("http://localhost:5000/send-email", {
              params: {
                BussinessEmail: value.trim(),
                TimeSend: dayjs(formattedTime).format(
                  "dddd, MMMM D, YYYY h:mm A"
                ),
              },
            });
            message.open({
              type: "success",
              content: `Gửi mail thành công đến ${value.trim()}`,
            });
          } else {
            await axios.get("http://localhost:5000/send-email", {
              params: {
                BussinessEmail: item.trim(),
                TimeSend: dayjs(formattedTime).format(
                  "dddd, MMMM D, YYYY h:mm A"
                ),
              },
            });
            message.open({
              type: "success",
              content: `Gửi mail thành công đến ${item.trim()}`,
            });
          }
        }
      } catch (error) {
        console.log(error);
        message.error({
          type: "error",
          content: `${item.trim()} gửi thất bại `,
        });
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
      >
        <Card
          title="GỬI MAIL ĐỒNG LOẠT"
          bordered={false}
          style={{
            width: 900,
            height: "100%",
          }}
        >
          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="mails"
              label="Danh sách mail"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập danh sách mail cần gửi",
                },
              ]}
            >
              <Input.TextArea
                rows={20}
                placeholder="Nhập vào đây danh sách email cần gửi"
              />
            </Form.Item>
            <Row justify="center">
              <Button
                style={{ width: "200px", height: "50px" }}
                type="primary"
                htmlType="submit"
                size="large"
              >
                GỬI
              </Button>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
