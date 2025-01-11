import unittest
from policy_manager import evaluate_policy

class TestPolicyManager(unittest.TestCase):
    def test_policy_evaluation(self):
        self.assertEqual(evaluate_policy({"protocol": "TCP"}), "ALLOW")

if __name__ == "__main__":
    unittest.main()
